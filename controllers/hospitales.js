const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre email');
       
        res.json({
            ok: true,
            hospitales
        });

}

const crearHospital = async (req, res) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        
        const hospitalDB = await hospital.save();
         
        res.json({
            ok: true,
            hospital: hospitalDB
            //hospitales
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear hospital',
        });
    }

}

const actualizarHospital = async (req, res) => {

    //const hospitales = await Hospital.find({}, 'nombre img');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        msg: 'actualizarHospital'
        //hospitales
    })

}

const borrarHospital = async (req, res) => {

    //const hospitales = await Hospital.find({}, 'nombre img');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        msg: 'borrarHospital'
        //hospitales
    })

}

module.exports = {
    getHospitales,crearHospital, actualizarHospital, borrarHospital
}