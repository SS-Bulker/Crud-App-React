import React, {Component} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

class Agregar extends Component {

    state = {
        genero: [],
        cliente: [],
        status: null,
        mensaje: null,
        statusCliente: null
    }

    componentWillMount() {
        this.obtenerGenero();
    }

    obtenerGenero = () => {
        axios.get('http://dinamica-back.test/genero')
                .then(res => {
                    if(res.data.error === 0){
                        this.setState({
                            genero: res.data.data,
                            status: 'success',
                            mensaje: res.data.mensaje
                        })
                    }else if(res.data.error === 1){
                        this.setState({
                            genero: null,
                            status: 'error',
                            mensaje: res.data.mensaje
                        })
                    }
                })
    }

    documentoRef = React.createRef();
    nombreRef = React.createRef();
    fechaRef = React.createRef();
    generoRef = React.createRef();
    hijosRef = React.createRef();
    idiomaRef = React.createRef();

    modificarState = () => {
        this.setState({ 
            cliente: {
                documento: this.documentoRef.current.value,
                nombre: this.nombreRef.current.value,
                fecha: this.fechaRef.current.value,
                genero: this.generoRef.current.value,
                hijos: this.hijosRef.current.value,
                idioma: this.idiomaRef.current.value
            },
            statusCliente: 'success'
        })
    }

    guardarCliente = (e) => {
        e.preventDefault();
        
        this.modificarState();

        axios.post('http://dinamica-back.test/crear', this.state.cliente)
                .then(res => {
                    console.log(res)
                    if(res.data.error === 0){
                        this.setState({
                            cliente: res.data.data,
                            statusCliente: 'success'
                        })
                        Swal.fire(
                            'Se creo el cliente satisfactoriamente.',
                            'Da clic en el botón para continuar.',
                            'success'
                        ).then(function() {
                            window.location.reload(true);
                        });

                    }else{
                        this.setState({
                            statusCliente: 'failed'
                        })
                        Swal.fire(
                            res.data.mensaje,
                            'Da clic en el botón para continuar.',
                            'error'
                        )  
                    }
                });
    }
    
    render(){

        let generos = null;

        if(this.state.genero.length > 0){

            generos = this.state.genero.map((genero) => {
                return(
                    <option value={genero.codigo}>{genero.descripcion}</option>
                );
            });
            
        } 

        return(
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body">
                        <form action="" method="POST" id="formClientes" onSubmit={this.guardarCliente}>
                            <h1>Crear cliente</h1>
                            <div className="form-group">
                                <label for=""># Documento: <span className="text-danger">*</span></label>
                                <input type="number" name="numeroDocumento" className="form-control" ref={this.documentoRef} onChange={this.modificarState} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Nombre <span className="text-danger">*</span></label>
                                <input type="text" name="nombre" className="form-control" ref={this.nombreRef} onChange={this.modificarState} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Fecha nacimiento: <span className="text-danger">*</span></label>
                                <input type="date" name="fechaNacimiento" className="form-control" ref={this.fechaRef} onChange={this.modificarState} required/>
                            </div>
                            <div className="form-group">
                                <label for="">Genero: <span className="text-danger">*</span></label>
                                <div className="input-group mb-3">
                                    <select className="custom-select" name="genero" id="inputGroupSelect02" ref={this.generoRef} onChange={this.modificarState} required>
                                        <option selected>Seleccione</option>
                                        {generos}
                                    </select>
                                </div>  
                            </div>
                            <div className="form-group">
                                <label for=""># Hijos: <span className="text-danger">*</span></label>
                                <input type="number" name="numeroHijos" className="form-control" ref={this.hijosRef} onChange={this.modificarState} required/>
                            </div>
                            <div className="form-group">
                                <label for="">¿Sabes otro idioma? </label>
                                <br/>
                                <div className="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="1" name="sabeidioma" id="defaultCheck1" ref={this.idiomaRef} onChange={this.modificarState} />
                                    <label class="form-check-label" for="defaultCheck1">Si</label>
                                </div>  
                                <div className="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="0" name="sabeidioma" id="defaultCheck2" ref={this.idiomaRef} onChange={this.modificarState} />
                                    <label class="form-check-label" for="defaultCheck2">No</label>
                                </div>  
                            </div>
                            <button type="submit" className="btn btn-primary">Crear</button>
                        </form>
                    </div>
                </div>
            </div>  
        );
    }

}

export default Agregar;