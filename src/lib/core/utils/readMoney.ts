function readGroup(group: string) {
  const readDigit = [
    ' Không',
    ' Một',
    ' Hai',
    ' Ba',
    ' Bốn',
    ' Năm',
    ' Sáu',
    ' Bảy',
    ' Tám',
    ' Chín',
  ];
  let temp = '';
  if (group === '000') return '';
  temp = `${readDigit[Number(group.substring(0, 1))]} Trăm`;
  if (group.substring(1, 2) === '0')
    if (group.substring(2, 3) === '0') return temp;
    else {
      temp += ` Lẻ${readDigit[Number(group.substring(2, 3))]}`;
      return temp;
    }
  temp += `${readDigit[Number(group.substring(1, 2))]} Mươi`;
  if (group.substring(2, 3) === '5') temp += ' Lăm';
  else if (group.substring(2, 3) !== '0')
    temp += readDigit[Number(group.substring(2, 3))];
  return temp;
}

function readMoney(num?: string) {
  if (num === null || num === '' || num === undefined) return '';
  let temp = '';
  while (num.toString().length < 18) {
    num = `0${num}`;
  }
  const g1 = num.substring(0, 3);
  const g2 = num.substring(3, 6);
  const g3 = num.substring(6, 9);
  const g4 = num.substring(9, 12);
  const g5 = num.substring(12, 15);
  const g6 = num.substring(15, 18);
  if (g1 !== '000') {
    temp = readGroup(g1);
    temp += ' Triệu';
  }
  if (g2 !== '000') {
    temp += readGroup(g2);
    temp += ' Nghìn';
  }
  if (g3 !== '000') {
    temp += readGroup(g3);
    temp += ' Tỷ';
  } else if (temp !== '') {
    temp += ' Tỷ';
  }
  if (g4 !== '000') {
    temp += readGroup(g4);
    temp += ' Triệu';
  }
  if (g5 !== '000') {
    temp += readGroup(g5);
    temp += ' Nghìn';
  }
  temp += readGroup(g6);
  temp = temp.replaceAll('Một Mươi', 'Mười');
  temp = temp.trim();
  temp = temp.replaceAll('Không Trăm', '');
  temp = temp.trim();
  temp = temp.replaceAll('Mười Không', 'Mười');
  temp = temp.trim();
  temp = temp.replaceAll('Mươi Không', 'Mươi');
  temp = temp.trim();
  if (temp.indexOf('Lẻ') === 0) temp = temp.substring(2);
  temp = temp.trim();
  temp = temp.replaceAll('Mươi Một', 'Mươi Mốt');
  temp = temp.trim();
  const result =
    temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
  return `${result === '' ? 'Không' : result} đồng chẵn`;
}

export default readMoney;
