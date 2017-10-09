# node-dig-dns
Using node dns to query complex DNS is a hustle. This is a simple wrapper for the unix/linux/macos dig command. Output is parsed to JSON.

## Install
``
npm i node-dig-dns -S
``

## Usage
You can add [all args from dig](https://linux.die.net/man/1/dig) to the args array:
```
dig(['google.com', 'ANY'])
  .then((result) => {
    console.log(result)
   })
   .catch((err) => {
      console.log('Error:', err);
   });
```

## Result

The dig result is parsed and return in JSON:
```
{ question: [ [ ';google.com.', 'IN', 'ANY' ] ],
  answer: 
   [ { domain: 'google.com.',
       type: 'A',
       ttl: '268',
       class: 'IN',
       value: '216.58.211.110' },
     { domain: 'google.com.',
       type: 'AAAA',
       ttl: '268',
       class: 'IN',
       value: '2a00:1450:400e:809::200e' },
     { domain: 'google.com.',
       type: 'MX',
       ttl: '568',
       class: 'IN',
       value: '30 alt2.aspmx.l.google.com.' },
       
       ...
           
  time: 41,
  server: '8.8.8.8#53(8.8.8.8)',
  datetime: 'Mon Oct  9 23:56:37 2017',
  size: 373 }
```
