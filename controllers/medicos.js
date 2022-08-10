const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res) => {

    const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        medicos
    })

}

const crearMedico = async (req, res=response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear medico',
        });
    }

}

const actualizarMedico = async (req, res) => {

    //const hospitales = await Hospital.find({}, 'nombre img');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        msg: 'actualizarMedico'
        //hospitales
    })

}

const borrarMedico = async (req, res) => {

    //const hospitales = await Hospital.find({}, 'nombre img');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        msg: 'borrarMedico'
        //hospitales
    })

}

module.exports = {
    getMedicos,crearMedico, actualizarMedico, borrarMedico
}