

let b = Buffer.alloc(8);
b.writeUInt32BE(0xff99dd00, 0)
b.writeUInt32BE(0xaa99ffc0, 4)

let a = b.slice(0,2);
console.log(b, a);

console.log(b[7])
console.log(b[7]++)
console.log(b[7]++)

let c = Buffer.alloc(0);

c = Buffer.concat([c,b.slice(1)])

console.log('b', b)
console.log('c', c)
console.log('crev', c.reverse())