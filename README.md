# node-dig-dns [![npm version](https://badge.fury.io/js/node-dig-dns.svg)](https://badge.fury.io/js/node-dig-dns)
Using native node dns to query complex DNS is a hustle. This is a simple wrapper for the unix/linux/macos dig command (domain information grope). Output is parsed to JSON.

## Install
```
npm i node-dig-dns -S
```

## Usage
```
dig([args], (options))
```
You can add [all args from dig](https://linux.die.net/man/1/dig) to the args array.
### Examples
```
dig(['google.com', 'ANY'])
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log('Error:', err);
  });
```
Set custom DNS server:
```
dig(['@8.8.8.4','google.com', 'ANY'])
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log('Error:', err);
  });
```
### Options
Optional parameters:
* raw: Get the raw output as string. If +short option, raw output is default
* dig: Manually set the dig command (/my/custum/path/to/dig)

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
       
    ],         
  time: 41,
  server: '8.8.8.8#53(8.8.8.8)',
  datetime: 'Mon Oct  9 23:56:37 2017',
  size: 373 }
```
