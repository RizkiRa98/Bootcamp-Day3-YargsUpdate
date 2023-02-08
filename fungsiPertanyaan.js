const fs  = require('fs');
const { exit } = require('process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

//buat folder dan file
//buat variabel untuk menyimpan lokasi penyimpanan
const dirPath = './data';
const dataPath = './data/contacts.json';

//cek folder sudah ada atau tidak, jika tidak buat folder
//fungsi inisiasi data
function initData(){
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
  }
  //cek file sudah ada atau tidak, jika tidak buat file
  if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
  }
}

//buat fungsi dengan variabel pertanyaan
const pertanyaan = (question) =>{
  return new Promise((resolve, reject) =>{
   readline.question(question, (answer)=>{
     resolve(answer);
   })
  })
}

//buat fungsi read
const readData = (name)=>{
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8',));
  //Mencari nama yang sudah ada
  const detail = data.find((contact) => contact.name.toUpperCase() === name.toUpperCase());
  //jika kontak tidak ada
  if (!detail){
   console.log('Kontak tidak ada'); 
   return false;
  }
  console.log(detail);
  exit();
}

//buat fungsi kontak data
const listData = ()=>{
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8',));
  let i = 1;
  data.forEach((contact) => {
    console.log(`${i}. ${contact.name} - ${(contact.email) ? contact.email+' - ' : ''} ${contact.mobile}`);
    i++;
    exit();
  })
}

//buat fungsi delete
const deleteData = (name) =>{
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8',));
  const hapus = data.filter(contact => contact.name !== name);

  if (data.length !== hapus.length){
    console.log(`Kontak ${name} terhapus`);
    fs.writeFileSync(dataPath, JSON.stringify(hapus));
    exit();
  }else{
    console.log('Kontak tidak ada');
  }
}

//buat fungsi dengan variabel saveJawaban menggunakan arrow fungsi =>
 const saveJawaban = (name, email, mobile) => {
    const contact = {name, email, mobile}
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8',));
    
    //cek nama tidak boleh ada yang sama(unique)
    //gunakan uppercase untuk cek validasi besar kecilnya huruf 
    const cek = data.find((contact) => contact.name.toUpperCase() === name.toUpperCase());
    if (cek){
      console.log('Nama sudah terdaftar didalam kontak');
      readline.close()
      return false;
    }
    data.push(contact);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    console.log("Data Tersimpan")
    readline.close();
 }

//export fungsi agar bisa digunakan diluar file fungsi
 module.exports = {
  pertanyaan,
  saveJawaban,
  initData,
  readData,
  listData,
  deleteData,
 }