const fs  = require('fs');
const validator = require('validator');
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
    return false;
  }
}

const updateData = (oldName, name, email, mobile) =>{
 const oldContact = JSON.parse(fs.readFileSync(dataPath, 'utf-8',));
 //mencari data lama
 const data = oldContact.findIndex((contact)=> contact.name.toLowerCase() === oldName.toLowerCase());
  if(data === -1){
    console.log('Kontak tidak ada');
    return false;
  }
  const cek = oldContact.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  if(cek){
    console.log('Kontak Sudah Ada')
    return false;
  }
  oldContact[data].name = name;
  //cek validasi email
  if(email){
    if(!validator.isEmail(email)){
      console.log('Format Email Salah!');
      return false;
    }
    oldContact[data].email = email;
  }
  if(mobile){
    if(!validator.isMobilePhone(mobile, 'id-ID')){
      console.log('Format Phone Number Salah');
      return false;
    }
    oldContact[data].mobile = mobile;
  }

  //simpan di data yang baru
  fs.writeFileSync(dataPath, JSON.stringify(oldContact));
  console.log(`Kontak dengan nama ${oldName} berhasil di update menjadi ${name}`);
  readline.close();
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
  updateData,
 }