import crypto from 'crypto';

const len = 128;
const iterations = 12000;

// Hash a password with an optional salt
export default function hash(pwd, salt) {
  return new Promise(function hashPromise(resolve, reject) {
    // if all three are supplied just run through pbkdf2
    if (arguments.length === 2) {
      crypto.pbkdf2(pwd, salt, iterations, len, (err, key) => {
        if (err) {
          reject(err);
        }
        resolve({ salt, key });
      });
    }
    // otherwise if no salt is provided, generate a
    // random salt
    else {
      crypto.randomBytes(len, (err, result) => {
        if (err) {
          return reject(err);
        }
        salt = result.toString('base64');
        crypto.pbkdf2(pwd, salt, iterations, len, (err2, key) => {
          if (err2) {
            return reject(err);
          }
          return resolve({ salt, key });
        });
      });
    }
  });
}
