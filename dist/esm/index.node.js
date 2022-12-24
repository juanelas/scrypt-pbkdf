import"pbkdf2-hmac";import{webcrypto as e}from"crypto";const r=function(e){function r(e,r){return e<<r|e>>>32-r}const t=e.slice(0);for(let e=8;e>0;e-=2)t[4]^=r(t[0]+t[12],7),t[8]^=r(t[4]+t[0],9),t[12]^=r(t[8]+t[4],13),t[0]^=r(t[12]+t[8],18),t[9]^=r(t[5]+t[1],7),t[13]^=r(t[9]+t[5],9),t[1]^=r(t[13]+t[9],13),t[5]^=r(t[1]+t[13],18),t[14]^=r(t[10]+t[6],7),t[2]^=r(t[14]+t[10],9),t[6]^=r(t[2]+t[14],13),t[10]^=r(t[6]+t[2],18),t[3]^=r(t[15]+t[11],7),t[7]^=r(t[3]+t[15],9),t[11]^=r(t[7]+t[3],13),t[15]^=r(t[11]+t[7],18),t[1]^=r(t[0]+t[3],7),t[2]^=r(t[1]+t[0],9),t[3]^=r(t[2]+t[1],13),t[0]^=r(t[3]+t[2],18),t[6]^=r(t[5]+t[4],7),t[7]^=r(t[6]+t[5],9),t[4]^=r(t[7]+t[6],13),t[5]^=r(t[4]+t[7],18),t[11]^=r(t[10]+t[9],7),t[8]^=r(t[11]+t[10],9),t[9]^=r(t[8]+t[11],13),t[10]^=r(t[9]+t[8],18),t[12]^=r(t[15]+t[14],7),t[13]^=r(t[12]+t[15],9),t[14]^=r(t[13]+t[12],13),t[15]^=r(t[14]+t[13],18);for(let r=0;r<16;r++)e[r]=t[r]+e[r]},t=function(e,r){for(let t=0;t<e.length;t++)e[t]^=r[t]},n=function(e){const n=e.byteLength/128,i=16*(2*n-1),o=e.slice(i,i+16),f=new Uint32Array(e.length/2);let s=!0;for(let i=0;i<2*n;i++){const n=16*i,a=e.subarray(n,n+16);t(o,a),r(o);const u=16*(i>>1);if(s)for(let r=0;r<16;r++)e[u+r]=o[r];else for(let e=0;e<16;e++)f[u+e]=o[e];s=!s}const a=16*n;for(let r=0;r<a;r++)e[a+r]=f[r]},i=function(e,r){const i=e.byteLength/128,o=new Array(r);for(let t=0;t<r;t++)o[t]=e.slice(0),n(e);function f(e){const t=64*(2*i-1);return new DataView(e.buffer,t,64).getUint32(0,!0)%r}for(let i=0;i<r;i++){const r=f(e);t(e,o[r]),n(e)}},o=async function(e,r,t,n){if("string"==typeof e)e=(new TextEncoder).encode(e);else if(e instanceof ArrayBuffer)e=new Uint8Array(e);else if(!ArrayBuffer.isView(e))throw RangeError("P should be string, ArrayBuffer, TypedArray, DataView");if("string"==typeof r)r=(new TextEncoder).encode(r);else if(r instanceof ArrayBuffer)r=new Uint8Array(r);else if(!ArrayBuffer.isView(r))throw RangeError("S should be string, ArrayBuffer, TypedArray, DataView");if(!Number.isInteger(t)||t<=0||t>137438953440)throw RangeError("dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32");const i=void 0!==n&&void 0!==n.N?n.N:131072,o=void 0!==n&&void 0!==n.r?n.r:8,f=void 0!==n&&void 0!==n.p?n.p:1;if(!Number.isInteger(i)||i<=0||0!=(i&i-1))throw RangeError("N must be a power of 2");if(!Number.isInteger(o)||o<=0||!Number.isInteger(f)||f<=0||f*o>1073741823.75)throw RangeError("Parallelization parameter p and blocksize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.");return(await import("crypto")).scryptSync(e,r,t,{N:i,r:o,p:f,maxmem:256*i*o}).buffer},f=function(r=16){if(!Number.isInteger(r)||r<0)throw new RangeError("length must be integer >= 0");return 0===r?new ArrayBuffer(0):e.getRandomValues(new Uint8Array(r)).buffer};export{r as salsa208Core,f as salt,o as scrypt,n as scryptBlockMix,i as scryptROMix};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL3NhbHNhMjA4Q29yZS50cyIsIi4uLy4uL3NyYy90cy90eXBlZEFycmF5WG9yLnRzIiwiLi4vLi4vc3JjL3RzL3NjcnlwdEJsb2NrTWl4LnRzIiwiLi4vLi4vc3JjL3RzL3NjcnlwdFJvbU1peC50cyIsIi4uLy4uL3NyYy90cy9zY3J5cHQudHMiLCIuLi8uLi9zcmMvdHMvc2FsdC50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsic2Fsc2EyMDhDb3JlIiwiYXJyIiwiUiIsImEiLCJiIiwieCIsInNsaWNlIiwiaSIsInR5cGVkQXJyYXlYb3IiLCJhcnIxIiwiYXJyMiIsImxlbmd0aCIsInNjcnlwdEJsb2NrTWl4IiwiQiIsInIiLCJieXRlTGVuZ3RoIiwib2Zmc2V0MzIiLCJYIiwiWW9kZCIsIlVpbnQzMkFycmF5IiwiZXZlbiIsIm9mZnNldCIsIkJpIiwic3ViYXJyYXkiLCJvZmYyIiwiaiIsImhhbGZJbmRleCIsInNjcnlwdFJPTWl4IiwiTiIsIlYiLCJBcnJheSIsImludGVnZXJpZnlNb2ROIiwiVWludDMyYXJyIiwiRGF0YVZpZXciLCJidWZmZXIiLCJnZXRVaW50MzIiLCJzY3J5cHQiLCJhc3luYyIsIlAiLCJTIiwiZGtMZW4iLCJzY3J5cHRQYXJhbXMiLCJUZXh0RW5jb2RlciIsImVuY29kZSIsIkFycmF5QnVmZmVyIiwiVWludDhBcnJheSIsImlzVmlldyIsIlJhbmdlRXJyb3IiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ1bmRlZmluZWQiLCJwIiwiaW1wb3J0Iiwic2NyeXB0U3luYyIsIm1heG1lbSIsInNhbHQiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiXSwibWFwcGluZ3MiOiJ1REFXTSxNQUFBQSxFQUFlLFNBQVVDLEdBQzdCLFNBQVNDLEVBQUdDLEVBQVdDLEdBQ3JCLE9BQVFELEdBQUtDLEVBQU1ELElBQU8sR0FBS0MsQ0FDaEMsQ0FFRCxNQUFNQyxFQUFJSixFQUFJSyxNQUFNLEdBQ3BCLElBQUssSUFBSUMsRUFBSSxFQUFHQSxFQUFJLEVBQUdBLEdBQUssRUFDMUJGLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLElBQUssR0FDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksR0FDdkJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksSUFDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLEdBQUksSUFDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksR0FDdkJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksR0FDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLEdBQUksSUFDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLElBQUssSUFDeEJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLEdBQUksR0FDekJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLElBQUssR0FDekJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLElBQUssSUFDeEJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksSUFDeEJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLElBQUssR0FDekJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLElBQUssR0FDeEJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksSUFDeEJBLEVBQUUsS0FBT0gsRUFBRUcsRUFBRSxJQUFNQSxFQUFFLEdBQUksSUFDekJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksR0FDdkJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFLQSxFQUFFLEdBQUksR0FDdkJBLEVBQUUsSUFBTUgsRUFBRUcsRUFBRSxHQUFL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
