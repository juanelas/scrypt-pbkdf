"use strict";require("pbkdf2-hmac");var e=require("crypto");const r=function(e){function r(e,r){return e<<r|e>>>32-r}const t=e.slice(0);for(let e=8;e>0;e-=2)t[4]^=r(t[0]+t[12],7),t[8]^=r(t[4]+t[0],9),t[12]^=r(t[8]+t[4],13),t[0]^=r(t[12]+t[8],18),t[9]^=r(t[5]+t[1],7),t[13]^=r(t[9]+t[5],9),t[1]^=r(t[13]+t[9],13),t[5]^=r(t[1]+t[13],18),t[14]^=r(t[10]+t[6],7),t[2]^=r(t[14]+t[10],9),t[6]^=r(t[2]+t[14],13),t[10]^=r(t[6]+t[2],18),t[3]^=r(t[15]+t[11],7),t[7]^=r(t[3]+t[15],9),t[11]^=r(t[7]+t[3],13),t[15]^=r(t[11]+t[7],18),t[1]^=r(t[0]+t[3],7),t[2]^=r(t[1]+t[0],9),t[3]^=r(t[2]+t[1],13),t[0]^=r(t[3]+t[2],18),t[6]^=r(t[5]+t[4],7),t[7]^=r(t[6]+t[5],9),t[4]^=r(t[7]+t[6],13),t[5]^=r(t[4]+t[7],18),t[11]^=r(t[10]+t[9],7),t[8]^=r(t[11]+t[10],9),t[9]^=r(t[8]+t[11],13),t[10]^=r(t[9]+t[8],18),t[12]^=r(t[15]+t[14],7),t[13]^=r(t[12]+t[15],9),t[14]^=r(t[13]+t[12],13),t[15]^=r(t[14]+t[13],18);for(let r=0;r<16;r++)e[r]=t[r]+e[r]},t=function(e,r){for(let t=0;t<e.length;t++)e[t]^=r[t]},n=function(e){const n=e.byteLength/128,o=16*(2*n-1),i=e.slice(o,o+16),s=new Uint32Array(e.length/2);let f=!0;for(let o=0;o<2*n;o++){const n=16*o,a=e.subarray(n,n+16);t(i,a),r(i);const c=16*(o>>1);if(f)for(let r=0;r<16;r++)e[c+r]=i[r];else for(let e=0;e<16;e++)s[c+e]=i[e];f=!f}const a=16*n;for(let r=0;r<a;r++)e[a+r]=s[r]};exports.salsa208Core=r,exports.salt=function(r=16){if(!Number.isInteger(r)||r<0)throw new RangeError("length must be integer >= 0");return 0===r?new ArrayBuffer(0):e.webcrypto.getRandomValues(new Uint8Array(r)).buffer},exports.scrypt=async function(e,r,t,n){if("string"==typeof e)e=(new TextEncoder).encode(e);else if(e instanceof ArrayBuffer)e=new Uint8Array(e);else if(!ArrayBuffer.isView(e))throw RangeError("P should be string, ArrayBuffer, TypedArray, DataView");if("string"==typeof r)r=(new TextEncoder).encode(r);else if(r instanceof ArrayBuffer)r=new Uint8Array(r);else if(!ArrayBuffer.isView(r))throw RangeError("S should be string, ArrayBuffer, TypedArray, DataView");if(!Number.isInteger(t)||t<=0||t>137438953440)throw RangeError("dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32");const o=void 0!==n&&void 0!==n.N?n.N:131072,i=void 0!==n&&void 0!==n.r?n.r:8,s=void 0!==n&&void 0!==n.p?n.p:1;if(!Number.isInteger(o)||o<=0||0!=(o&o-1))throw RangeError("N must be a power of 2");if(!Number.isInteger(i)||i<=0||!Number.isInteger(s)||s<=0||s*i>1073741823.75)throw RangeError("Parallelization parameter p and blocksize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.");return(await import("crypto")).scryptSync(e,r,t,{N:o,r:i,p:s,maxmem:160*o*i}).buffer},exports.scryptBlockMix=n,exports.scryptROMix=function(e,r){const o=e.byteLength/128,i=new Array(r);for(let t=0;t<r;t++)i[t]=e.slice(0),n(e);function s(e){const t=64*(2*o-1);return new DataView(e.buffer,t,64).getUint32(0,!0)%r}for(let o=0;o<r;o++){const r=s(e);t(e,i[r]),n(e)}};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5janMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cy9zYWxzYTIwOENvcmUudHMiLCIuLi8uLi9zcmMvdHMvdHlwZWRBcnJheVhvci50cyIsIi4uLy4uL3NyYy90cy9zY3J5cHRCbG9ja01peC50cyIsIi4uLy4uL3NyYy90cy9zYWx0LnRzIiwiLi4vLi4vc3JjL3RzL3NjcnlwdC50cyIsIi4uLy4uL3NyYy90cy9zY3J5cHRSb21NaXgudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbInNhbHNhMjA4Q29yZSIsImFyciIsIlIiLCJhIiwiYiIsIngiLCJzbGljZSIsImkiLCJ0eXBlZEFycmF5WG9yIiwiYXJyMSIsImFycjIiLCJsZW5ndGgiLCJzY3J5cHRCbG9ja01peCIsIkIiLCJyIiwiYnl0ZUxlbmd0aCIsIm9mZnNldDMyIiwiWCIsIllvZGQiLCJVaW50MzJBcnJheSIsImV2ZW4iLCJvZmZzZXQiLCJCaSIsInN1YmFycmF5Iiwib2ZmMiIsImoiLCJoYWxmSW5kZXgiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJSYW5nZUVycm9yIiwiQXJyYXlCdWZmZXIiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJVaW50OEFycmF5IiwiYnVmZmVyIiwiYXN5bmMiLCJQIiwiUyIsImRrTGVuIiwic2NyeXB0UGFyYW1zIiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJpc1ZpZXciLCJOIiwidW5kZWZpbmVkIiwicCIsImltcG9ydCIsInNjcnlwdFN5bmMiLCJtYXhtZW0iLCJWIiwiQXJyYXkiLCJpbnRlZ2VyaWZ5TW9kTiIsIlVpbnQzMmFyciIsIkRhdGFWaWV3IiwiZ2V0VWludDMyIl0sIm1hcHBpbmdzIjoiNERBV00sTUFBQUEsRUFBZSxTQUFVQyxHQUM3QixTQUFTQyxFQUFHQyxFQUFXQyxHQUNyQixPQUFRRCxHQUFLQyxFQUFNRCxJQUFPLEdBQUtDLENBQ2hDLENBRUQsTUFBTUMsRUFBSUosRUFBSUssTUFBTSxHQUNwQixJQUFLLElBQUlDLEVBQUksRUFBR0EsRUFBSSxFQUFHQSxHQUFLLEVBQzFCRixFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxJQUFLLEdBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLEdBQ3ZCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLElBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxHQUFJLElBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLEdBQ3ZCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLEdBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxHQUFJLElBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxJQUFLLElBQ3hCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxHQUFJLEdBQ3pCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxJQUFLLEdBQ3pCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxJQUFLLElBQ3hCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLElBQ3hCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxJQUFLLEdBQ3pCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxJQUFLLEdBQ3hCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLElBQ3hCQSxFQUFFLEtBQU9ILEVBQUVHLEVBQUUsSUFBTUEsRUFBRSxHQUFJLElBQ3pCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLEdBQ3ZCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLEdBQ3ZCQSxFQUFFLElBQU1ILEVBQUVHLEVBQUUsR0FBS0EsRUFBRSxHQUFJLElBQ3ZCQSxFQUFFLElBQU1I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
