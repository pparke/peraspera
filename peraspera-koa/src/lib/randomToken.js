import crypto from 'crypto';
import base64url from 'base64url';

export default function randomToken(size) {
  return base64url(crypto.randomBytes(size));
}
