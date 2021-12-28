import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class Clientes extends Component {

    state = {
        clientes: [],
        status: null,
        mensaje: '',
        editar: false,
        idEditar: null,
        cliente: []
    }

    componentWillMount() {
        moment.lang('es', {
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
            weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
            weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
          }
          );
        this.obtenerClientes()
    }

    obtenerClientes = () => {
        axios.get('http://dinamica-back.test/')
            .then(res => {
                if(res.data.error === 0){
                    this.setState({
                        clientes: res.data.data,
                        status: 'success',
                        mensaje: res.data.mensaje
                    })
                }else if(res.data.error === 1){
                    this.setState({
                        clientes: [],
                        status: 'error',
                        mensaje: res.data.mensaje
                    })
                }

            })
    }

    documentoEditarRef = React.createRef();
    nombreEditarRef = React.createRef();
    fechaEditarRef = React.createRef();
    generoEditarRef = React.createRef();
    hijosEditarRef = React.createRef();
    idiomaEditarRef = React.createRef();
    idEditarRef = React.createRef();

    modificarState = () => {
        this.setState({ 
            cliente: {
                documento: this.documentoEditarRef.current.value,
                nombre: this.nombreEditarRef.current.value,
                fecha: this.fechaEditarRef.current.value,
                genero: this.generoEditarRef.current.value,
                hijos: this.hijosEditarRef.current.value,
                idioma: this.idiomaEditarRef.current.value,
                idEditar: this.idEditarRef.current.value 
            },
            status: 'success'
        })
    }

    editar = (id, e) => {
        e.preventDefault();

        this.setState({
            editar: !this.state.editar,
            idEditar: id
        })

        this.consultarCliente(id);
        
    }

    editarCliente = (e) => {
        e.preventDefault();
        
        this.modificarState();

        axios.post('http://dinamica-back.test/editar', this.state.cliente)
                .then(res => {
                    console.log(res)
                    if(res.data.error === 0){
                        this.setState({
                            status: 'success'
                        })
                        Swal.fire(
                            'Se ha actualziado la información del cliente correctamente.',
                            'Da clic en el botón para continuar.',
                            'success'
                        ).then(function() {
                            window.location.reload(true);
                        });

                    }else{
                        this.setState({
                            status: 'failed'
                        })
                        Swal.fire(
                            res.data.mensaje,
                            'Da clic en el botón para continuar.',
                            'error'
                        )  
                    }
                });

    }

    consultarCliente = (id) => {
        axios.get('http://dinamica-back.test/buscar?id='+id)
            .then(res => {
                if(res.data.error == 0){
                    this.setState({
                        cliente: res.data.data,
                        status: 'success',
                        mensaje: res.data.mensaje
                    })
                }else if(res.data.error == 1){
                    this.setState({
                        cliente: null,
                        status: 'error',
                        mensaje: res.data.mensaje
                    })
                }

            })
    }

    eliminar = (id, e) => {
        e.preventDefault();
        Swal.fire({
            title: '¿Realmente quieres eliminar este cliente?',
            text: "Si eliminas este cliente toda su información se perdera",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.eliminarCliente(id)
            }
          })
    }

    eliminarCliente = (id) => {
        axios.get('http://dinamica-back.test/eliminar?id='+id)
                .then(res => {
                    if(res.data.error === 0){
                        Swal.fire(
                            'Se elimino el cliente satisfactoriamente.',
                            'Da clic en el botón, para continuar.',
                            'success'
                        ).then(function() {
                            window.location.reload(true);
                        });
                    }else if(res.data.error === 1){
                        Swal.fire(
                            res.data.mensaje,
                            'Da clic en el botón para continuar.',
                            'error'
                        )  
                    }
                })
    }

    render(){
        if(this.state.clientes.length > 0){
            
            let clientes = this.state.clientes.map((cliente) => {
                let cantidadHijos = '';
                let idiomas = '';

                if(cliente.nrohijos == 0){
                    cantidadHijos = 'No tiene hijos';
                }else{
                    cantidadHijos = cliente.nrohijos
                }

                if(cliente.manejaotrosidiomas == 0){
                    idiomas = 'No maneja otros idiomas';
                }else{
                    idiomas = 'Si maneja otros idiomas';
                }

                return (
                    <tr>
                        <td>{cliente.nroidentificacion}</td>
                        <td>{cliente.nombres}</td>
                        <td>{moment(cliente.fechanac).format('LL')}</td>
                        <td>{cliente.descripcion}</td>
                        <td>{cantidadHijos}</td>
                        <td>{idiomas}</td>
                        <td>
                            <button type="button" onClick={(e) => this.editar(cliente.nroidentificacion, e)} className="btn btn-warning">Editar</button>
                            <button type="button" onClick={(e) => this.eliminar(cliente.nroidentificacion, e)} className="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>             
                );
            })

            return(
                <>
                <tbody>
                    {clientes}
                </tbody>

                
                <Modal isOpen={this.state.editar}>
                <form action="" method="POST" id="formEditarClientes" onSubmit={this.editarCliente}>
                    <ModalHeader>
                        <h5 class="modal-title">Editar cliente</h5>
                    </ModalHeader>
                    <ModalBody>
                            <div className="form-group">
                                <label for=""># Documento: <span className="text-danger">*</span></label>
                                <input type="number" name="numeroDocumento" className="form-control" ref={this.documentoEditarRef} onChange={this.modificarState} value={this.state.cliente.nroidentificacion} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Nombre <span className="text-danger">*</span></label>
                                <input type="text" name="nombre" className="form-control" ref={this.nombreEditarRef} onChange={this.modificarState} value={this.state.cliente.nombres} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Fecha nacimiento: <span className="text-danger">*</span></label>
                                <input type="date" name="fechaNacimiento" className="form-control" ref={this.fechaEditarRef} onChange={this.modificarState} value={this.state.cliente.fechanac} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Genero: <span className="text-danger">*</span></label>
                                <div className="input-group mb-3">
                                    <select className="custom-select" name="genero" id="inputGroupSelect02" ref={this.generoEditarRef} onChange={this.modificarState} required>
                                        <option>Seleccione</option>
                                        <option value="1">Masculino</option>
                                        <option value="2">Femenino</option>
                                        <option value="3">Otro</option>
                                    </select>
                                </div>  
                            </div>
                            <div className="form-group">
                                <label for=""># Hijos: <span className="text-danger">*</span></label>
                                <input type="number" name="numeroHijos" className="form-control" ref={this.hijosEditarRef} onChange={this.modificarState} value={this.state.cliente.nrohijos} required/>
                            </div>
                            <div className="form-group">
                                <input type="hidden" name="id" className="form-control" ref={this.idEditarRef} onChange={this.modificarState} value={this.state.idEditar} required/>
                            </div>
                            <div className="form-group">
                                <label for="">¿Sabes otro idioma? </label>
                                <br/>
                                <div className="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="1" name="sabeidioma" id="defaultCheck1" ref={this.idiomaEditarRef} onChange={this.modificarState} />
                                    <label class="form-check-label" for="defaultCheck1">Si</label>
                                </div>  
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" value="0" name="sabeidioma" id="defaultCheck2" ref={this.idiomaEditarRef} onChange={this.modificarState} />
                                    <label className="form-check-label" for="defaultCheck2">No</label>
                                </div>  
                            </div>
                        
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" onClick={(e) => this.editar(this.state.idEditar, e)} className="btn btn-danger" data-dismiss="modal">Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar cambios</button>
                    </ModalFooter>
                    </form>
                </Modal>
                </>
            );

        }else if(this.state.clientes.length === 0){
            return(
                <tbody>
                                
                </tbody>
            );
        }
        
    }


}

export default Clientes;