import compact from 'lodash.compact';
import child from 'child_process';

function parseSection(values, section) {
  if (
    section === 'answer' ||
    section === 'additional') {
      var value = values[values.length - 1];
      if(values[3] === 'MX'){
        value = {
          priority: values[4],
          server: values[5]
        }
      }
    return {
      domain: values[0],
      type: values[3],
      ttl: values[1],
      class: values[2],
      value: value,
    };
  }
  return values;
}

function parse(output = '') {
  const regex = /(;; )([^\s]+)( SECTION:)/g;
  const result = {};
  const data = output.split(/\r?\n/);
  let section = 'header';
  if (data.length < 6) {
    let msg = data[data.length - 2];
    if (!msg || msg.length <= 1) {
      msg = output;
    }
    throw new Error(msg);
  }
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
      try {
        const result = (raw !== true) ?
          parse(shellOutput) :
          shellOutput.replace(/\n$/, '');
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default dig;
module.exports = dig;
