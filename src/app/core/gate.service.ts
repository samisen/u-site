import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { GATE_ITERATIONS, GATE_KEY, GATE_SALT } from './gate-key';

const STORAGE_KEY = 'tirta-gate';

/**
 * The lock on the front door.
 *
 * The site is a work in progress shown by invitation, so it asks for a code
 * before it shows itself. The code is never in the bundle: the build derives a
 * PBKDF2 key from it (see scripts/gate-key.mjs) and the browser derives the
 * same key from what the visitor types and compares the two.
 *
 * What this is honest about: the comparison happens in the visitor's browser,
 * so someone who opens the developer tools can walk past it. It is a door that
 * keeps out people who were not invited and crawlers that were not asked — not
 * a place to keep anything that would matter if it got out.
 *
 * A visitor who gets in stays in: the derived key is kept in local storage, and
 * because the stored value *is* the key, changing the password at build time
 * silently invalidates every device that had the old one.
 */
@Injectable({ providedIn: 'root' })
export class GateService {
  private readonly doc = inject(DOCUMENT);

  readonly unlocked = signal(false);
  readonly checking = signal(false);

  /** True where the browser will not do the maths — a plain-http origin. */
  readonly unavailable = signal(false);

  constructor() {
    const crypto = this.doc.defaultView?.crypto;
    if (!crypto?.subtle) this.unavailable.set(true);
    if (this.read() === GATE_KEY) this.unlocked.set(true);
  }

  /** Resolves true when the code was right, and opens the site if it was. */
  async unlock(password: string): Promise<boolean> {
    if (this.unavailable()) return false;
    this.checking.set(true);
    try {
      const ok = (await this.derive(password)) === GATE_KEY;
      if (ok) {
        this.write(GATE_KEY);
        this.unlocked.set(true);
      }
      return ok;
    } catch {
      this.unavailable.set(true);
      return false;
    } finally {
      this.checking.set(false);
    }
  }

  lock(): void {
    this.unlocked.set(false);
    try {
      this.doc.defaultView?.localStorage.removeItem(STORAGE_KEY);
    } catch { /* private browsing; the signal is enough */ }
  }

  /** The same derivation the build script runs, in the browser's own crypto. */
  private async derive(password: string): Promise<string> {
    const subtle = this.doc.defaultView!.crypto.subtle;
    const bytes = new TextEncoder();
    const material = await subtle.importKey('raw', bytes.encode(password), 'PBKDF2', false, [
      'deriveBits',
    ]);
    const bits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: bytes.encode(GATE_SALT),
        iterations: GATE_ITERATIONS,
        hash: 'SHA-256',
      },
      material,
      256,
    );
    return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, '0')).join('');
  }

  private read(): string | null {
    try {
      return this.doc.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private write(value: string): void {
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, value);
    } catch { /* private browsing: they will type it again next visit */ }
  }
}
