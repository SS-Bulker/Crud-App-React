import React, {Component} from "react";

import Agregar from "./Agregar";
import Clientes from "./Clientes";

class Lista extends Component{

    render(){
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-8">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th># Documento</th>
                                <th>Nombre</th>
                                <th>Fecha nacimiento</th>
                                <th>Genero</th>
                                <th># Hijos</th>
                                <th>¿Sabes otro idioma?</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <Clientes />
                        </table>
                    </div>
                    <Agregar />
                </div>
            </div>
        );
    }

}

export default Lista;