import React, { Component } from 'react';
import { calculateSalaryFrom } from './components/salary'
import './global.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      fullSalary: ''
    }
  }


  handlerInput = (event) => {
    const inputSallary = event.target.value
    const { fullSalary } = this.state;
    this.setState({
      fullSalary: inputSallary,
    });
  }

  render() {
    const { fullSalary } = this.state
    const total = calculateSalaryFrom(fullSalary)


    const descontoINSS = (total.discountINSS).toFixed(2);
    const baseIRPF = (total.baseIRPF).toFixed(2);
    const descontoIRPF = (total.discountIRPF).toFixed(2);
    const totalSalario = (total.netSalary).toFixed(2);

    return (
      <div>
        <h1>Trábalho Prático - IGTI</h1>
        <label>Salário bruto: </label>
        <input name="inputSallary" type="text" value={this.state.value} onChange={this.handlerInput} ></input>
        <div className="input-block">
          <input disabled placeholder={`Base INSS: R$ ${total.baseINSS}`}></input>
          <input className="dscINSS" disabled placeholder={`Desconto INSS: R$ ${descontoINSS}`}></input>
          <input disabled placeholder={`Base IRPF: R$ ${baseIRPF}`}></input>
          <input className="dscIRPF" disabled placeholder={`Desconto IRPF: R$ ${descontoIRPF}`}></input>
          <input className="salLiq" disabled placeholder={`Salário líquido: R$ ${totalSalario}`}></input>
        </div>
        <progress max="100" id="myBar" value="0" className="progressBar"></progress>

      </div>
    )
  }
}

export default App;
