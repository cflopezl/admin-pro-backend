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

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById( id );
        if( !hospitalDB ){
            res.status(404).json({
                ok: false,
                msg: 'hospital no encontrado',
            });
        }

        //ejemplo cuando es solo un campo
        //hospitalDB.nombre = req.body.nombre;
        //otra forma de hacerlo
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        //{new: true} nos devuelve el documento actualizado
        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );
        
        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar hospital',
        });
    }

}

const borrarHospital = async (req, res) => {

    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById( id );
        if( !hospitalDB ){
            res.status(404).json({
                ok: false,
                msg: 'hospital no encontrado',
            });
        }

        await Hospital.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar hospital',
        });
    }


}

module.exports = {
    getHospitales,crearHospital, actualizarHospital, borrarHospital
}