import compact from 'lodash.compact';
import child from 'child_process';

function parseSection(values, section) {
  if (section === 'answer') {
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
  const regex = /(;)(;)( )([^\s]+)( )(SECTION)(:)/g;
  const result = {};
  const data = output.split(/\r?\n/);
  let section = '';
  data.forEach((line, i) => {
    let m;
    let changed = false;
    if (!line) section = '';
    else {
      do {
        m = regex.exec(line);
        if (m) {
          changed = true;
          section = m[4].toLowerCase();
        }
      } while (m);
    }
    if (section) {
      if (!result[section]) result[section] = [];
      if (!changed) result[section].push(parseSection(compact(line.split(/\t/)), section));
    }
    if (i === data.length - 6) result.time = Number(line.replace(';; Query time: ', '').replace(' msec', ''));
    if (i === data.length - 5) result.server = line.replace(';; SERVER: ', '');
    if (i === data.length - 4) result.datetime = line.replace(';; WHEN: ', '');
    if (i === data.length - 3) result.size = Number(line.replace(';; MSG SIZE  rcvd: ', ''));
  });
  return result;
}

export default function (args) {
  return new Promise((resolve, reject) => {
    const process = child.spawn('dig', args);
    let shellOutput = '';

    process.stdout.on('data', (chunk) => {
      shellOutput += chunk;
    });

    process.stdout.on('error', (error) => {
      reject(error);
    });

    process.stdout.on('end', () => {
      const result = parse(shellOutput);
      resolve(result);
    });
  });
}
