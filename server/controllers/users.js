const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path')

require('dotenv').config();

function saveUser(req, res) {
    let params = req.body;
    const user = new User();
    if (params.username && params.email && params.password) {
        user.username = params.username;
        user.email = params.email;
        user.password = params.password;
        user.role = 'ROLE_USER';
        user.terms = params.conditions;
        user.avatar = null;
        user.confirmedEmail = false

        User.find({
            $or: [{
                    email: user.email.toLowerCase()
                },
                {
                    username: user.username.toLowerCase()
                }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({
                message: 'error a la peticion de usuarios'
            })
            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'El usuario ya esta registrado'
                })
            } else {
                bcrypt.hash(params.password, 10, (err, hash) => {
                    user.password = hash;

                    user.save((err, userSaved) => {
                        if (err) return res.status(500).send({
                            message: 'error al guardar usuario'
                        });
                        if (userSaved) {
                            const token = jwt.sign({
                                _id: userSaved._id
                            }, process.env.TOKEN_SECRET || "Tokenimage");
                            // const url = `http://localhost:3000/api/activation/${token}`
                            // transporter.sendMail({
                            //     from: "bootcampstream@gmail.com",
                            //     to: user.email,
                            //     subject: "Active su cuenta en nuestra web de intercambio de libros",
                            //     html: `
                            //   <h1>Bienvenido a nuestra página de viajes</h1>
                            //   <p>Porfavor, active su cuenta clicando el siguiente link:
                            //     <a href="${url}">
                            //       click aquí para activar tu cuenta
                            //     </a>
                            //   </p>
                            //   `
                            // });
                            res.json({
                                token: token,
                                user: userSaved,
                                message: "Usuario regitrsado, confirme su dirección"
                            });;
                        } else {
                            res.status(404).send({
                                message: 'no se ha registrado el usuario'
                            })
                        }
                    });
                })
            }
        });


    } else {
        res.status(200).send({
            message: 'rellena todos los campos'
        })
    }
}

function activation(req, res) {
    
    try {
        const payload = jwt.verify(req.params.jwt, process.env.TOKEN_SECRET)
    
        User.findByIdAndUpdate(payload._id, {
                confirmedEmail: true
            }, {
                new: true
            })
            .then(res.status(200).send({
                message: "email verificado"
            }))
    } catch (error) {
        res.status(400).send(error)
    }
}

function login(req, res) {
    const params = req.body;
    const email = params.email;

    const password = params.password;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) return res.status(500).send({
            message: 'error en la petición'
        });
        console.log(err)
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    user.password = undefined;
                    const token = jwt.sign({
                        _id: user._id
                    }, process.env.TOKEN_SECRET || "Tokenimage", {
                        expiresIn: 60 * 60 * 24
                    });
                    // if (user.confirmedEmail === false) {
                    //     const url = `http://localhost:3000/api/activation/${token}`
                    //     transporter.sendMail({
                    //         from: "bootcampstream@gmail.com",
                    //         to: user.email,
                    //         subject: "Active su cuenta en nuestra web de intercambio de libros",
                    //         html: `
                    //           <h1>Bienvenido a nuestra página de viajes</h1>
                    //           <p>Porfavor, active su cuenta clicando el siguiente link:
                    //             <a href="${url}">
                    //               click aquí para activar tu cuenta
                    //             </a>
                    //           </p>
                    //           `
                    //     });
                    //     res.json({
                    //         token: token,
                    //         user: userSaved,
                    //         message: "Usuario regitrsado, cofirme su dirección"
                    //     });;
                    // } else 
                    {
                        res.json({
                            token: token,
                            user: user
                        });
                    }

                } else {
                    return res.status(404).send({
                        message: 'no se ha podido identificar'
                    })
                }
            });
        } else {
            return res.status(404).send({
                message: 'El usuario no se ha podido identificar'
            })
        }
    })
}

async function getUser(req, res) {
    const user = await User.findById(req.params.id);

    user.password = undefined;
    return res.json(user);
}


function getUsers(req, res) {
    console.log(req.user)
    // let identity_user_id = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page
    }
    const itemsPerPage = 5
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: 'error en la peticion'
        })
        if (!users) return res.status(404).send({
            message: 'No hay usuarios'
        })
        return res.status(200).send({
            users,
            total,
            page: Math.ceil(total / itemsPerPage)
        })

    })
}




function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;
    delete update.password;
    if (userId != req.body._id) {
        return res.status(500).send({
            message: 'No tienes permiso'
        })
    }
    User.findOne({
        $or: [{
                username: update.username.toLowerCase()
            },
            {
                email: update.email.toLowerCase()
            }
        ]
    }).exec((err, users) => {
        let user_isset = false;
        [users].forEach((user) => {
            if (user && user._id != userId) user_isset = true;
        })
        if (user_isset) return res.status(404).send({
            message: "los datos ya están usados"
        })
        
        User.findByIdAndUpdate(userId, update, {
            new: true
        }, (err, userUpdated) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion'
                })
            }
            
            if (!userUpdated) return res.status(404).send({
                message: 'No se ha podido actualizar'
            })
            userUpdated.password = undefined;
            return res.status(200).send({
                user: userUpdated
            })
        })

    })
}

function uploadAvatar(req, res) {
    const userId = req.params.id;

    if (req.files) {
        const file_path = req.files.avatar.path;
        const file_split = file_path.split('/');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1]

        if (userId != req.user._id) {
            return removeUploadsFiles(res, file_path, 'No tienes permiso')
        }
        if (file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {
                avatar: file_path
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) return res.status(500).send({
                    message: 'error en la peticion'
                })
                if (!userUpdated) return res.status(404).send({
                    message: 'No se ha podido actualizar'
                })
                return res.status(200).send({
                    user: userUpdated
                })
            })
        } else {
            return removeUploadsFiles(res, file_path, 'extencion no valida')
        }
    } else {
        return res.status(200).send({
            message: 'no se ha sibodo el avatar'
        })
    }
}

function removeUploadsFiles(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        })
    })
}


module.exports = {
    saveUser,
    activation,
    login,
    getUser,
    getUsers,
    updateUser,
    uploadAvatar,
}