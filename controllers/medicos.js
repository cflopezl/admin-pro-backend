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

const borrarMedico = async (req, res) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById( id );
        if( !medicoDB ){
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado',
            });
        }

        await Medico.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar medico',
        });
    }

}

const actualizarMedico = async (req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById( id );
        if( !medicoDB ){
            res.status(404).json({
                ok: false,
                msg: 'medico no encontrado',
            });
        }

        //ejemplo cuando es solo un campo
        //hospitalDB.nombre = req.body.nombre;
        //otra forma de hacerlo
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        //{new: true} nos devuelve el documento actualizado
        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } );
        
        res.json({
            ok: true,
            medico: medicoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar medico',
        });
    }

}

module.exports = {
    getMedicos,crearMedico, actualizarMedico, borrarMedico
}