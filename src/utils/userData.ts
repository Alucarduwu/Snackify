export interface Tarjeta{
    tipo: 'Visa'|'Mastercard'|'American Express';
    logo:string
    categoria:'credito'|'debito';
    cvv: string;
    expiration: string;
    numero: string;
    titular: string;
}

export interface User{
    name:string;
    perfil:string;
    email: string;
    direccion: string;
    tarjeta: Tarjeta
}

const userData : User = {
    name: 'Juan Jose Medina Perez',
    perfil:'/Img/User/LICHT.webp',
    email: 'gatogalleta777@gmail.com',
    direccion: 'calle Falsa #123, Col. Solidaridad 1, Aguascalientes,Ags',
    tarjeta:{
        tipo:'Visa',
        logo:'/Img/Icons/Visa.webp',
        categoria:'credito',
        cvv:'***',
        expiration:'08/27',
        numero: '*******4839',
        titular: 'Juan Medina'
    }
}

export default userData