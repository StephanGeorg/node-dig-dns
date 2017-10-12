import compact from 'lodash.compact';
import child from 'child_process';

function parseSection(values, section) {
  if (
    section === 'answer' ||
    section === 'additional') {
    return {
      domain: values[0],
      type: values[3],
      ttl: values[1],
      class: values[2],
      value: values[4],
    };
  }
  return values;
}

function parse(output = '') {
  const regex = /(;; )([^\s]+)( SECTION:)/g;
  const result = {};
  const data = output.split(/\r?\n/);
  let section = 'header';
  data.forEach((line, i) => {
    let m;
    let changed = false;
    if (i && !line) section = '';
    else {
      do {
        m = regex.exec(line);
        if (m) {
          changed = true;
          section = m[2].toLowerCase();
        }
      } while (m);
    }
    if (section) {
      if (!result[section]) result[section] = [];
      if (!changed && line) {
        if (section === 'header') result[section].push(parseSection(compact(line.split(/\t/)), section));
        else result[section].push(parseSection(compact(line.split(/\s+/g)), section));
      }
    }
  });
  result.time = Number(data[data.length - 6].replace(';; Query time: ', '').replace(' msec', ''));
  result.server = data[data.length - 5].replace(';; SERVER: ', '');
  result.datetime = data[data.length - 4].replace(';; WHEN: ', '');
  result.size = Number(data[data.length - 3].replace(';; MSG SIZE  rcvd: ', ''));
  return result;
}

const dig = function dig(args = [], options = {}) {
  const raw = (options.raw === true) ? options.raw : args.includes('+short');
  const digCMD = options.dig || 'dig';
  return new Promise((resolve, reject) => {
    const process = child.spawn(digCMD, args);
    let shellOutput = '';

    process.stdout.on('data', (chunk) => {
      shellOutput += chunk;
    });

    process.stdout.on('error', (error) => {
      reject(error);
    });

    process.stdout.on('end', () => {
      const result = (raw !== true) ?
        parse(shellOutput) :
        shellOutput.replace(/\n$/, '');
      resolve(result);
    });
  });
};

export default dig;
module.exports = dig;
