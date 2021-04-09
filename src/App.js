import React, { useEffect, useState } from 'react';
import { getExercisesByPagination, deleteExerciseById, saveExercise, getAllTypesExercises } from './controller/apiController';
import ItemExercise from './components/itemExercise';
import './styles/global.css';
import './styles/pages/app.css';

function App() {
  const [exercises, setExercises] = useState([]);
  const [typeExercisesForSelect, setTypeExercisesForSelect] = useState([]);
  const [durationExercise, setDurationExercise] = useState("");
  const [typeExercise, setTypeExercise] = useState("");
  const [totalExercisesHours, setTotalExercisesHours] = useState(0);
  const [dateExercise, setDateExercise] = useState("");
  const [maxExercise, setMaxExercise] = useState([]);


  function clearFields(){
    setDateExercise("");
    setTypeExercise("");
    setDurationExercise("")
  }

  function checkFields(){
    if(durationExercise === "" || typeExercise === "" || dateExercise === ""){
      return false;
    }

    return true;
  }
  
  async function createExercise(event){
    event.preventDefault();

    if(checkFields() != true){
      alert("Todos os campos devem estar preenchidos");
      return;
    }

    const res = await saveExercise({durationExercise, typeExercise, dateExercise});

    if(res.status === "success"){
      alert(res.message);
      clearFields();
      getExercises();
    }else{
      alert(res.message);
    }

  }

  async function getExercises(page = 1){
    const res = await getExercisesByPagination(page);

    if(res.status === "success"){
      setExercises(res.response);
      setMaxExercise(res.max);
      setTotalExercisesHours(res.total);
    }

    console.log("Response da api: ", res.response);
  }

  async function deleteExercise(idExercise){
    const res = await deleteExerciseById(idExercise);

    if(res.status === "success"){
      alert(res.message);
    }
  }

  async function getTypesExercises(){
    const res = await getAllTypesExercises();

    if(res.status === "success"){
      setTypeExercisesForSelect(res.response);
      return;
    }

    alert(res.message);
  }

  useEffect( () => {
    getExercises();
    getTypesExercises();
  }, []);

  return (
    <div className="container-general">
      <div className="container-content">
            <h1>Registro de Treino</h1>
            <div className="container-form">
              <form onSubmit={createExercise} className="create-exercise-form">
                <fieldset>
                  <legend>Insira um exercicio</legend>

                  <input 
                    id="durationExercise" 
                    value={durationExercise} 
                    placeholder="Tempo de duração"
                    onChange={event => setDurationExercise(event.target.value)} 
                  />

                  <select id="typeExercise" value={typeExercise} onChange={event => setTypeExercise(event.target.value)} >
                    <option value="" defaultValue={typeExercise}>Selecione a atividade</option>
                    {typeExercisesForSelect.map((typeExercise, index) => {
                      return (
                        <option key={index} value={typeExercise.name_type}>{typeExercise.name_type}</option>
                      );
                    })}
                  </select>

                  <input
                    id="dateExercise" 
                    value={dateExercise} 
                    onChange={event => setDateExercise(event.target.value)} 
                    type="date" 
                  />

                  <button className="btn-save success">Add</button>

                </fieldset>
              </form>
            </div>
            <div className="content-main">
                <div className="contant-main-top">
                  <span>Tempo</span>
                  <span>Tipo</span>
                  <span>Data</span>
                  <span>Excluir</span>
                </div>
                <div className="content-exercises">
                  {exercises.map((exercise, index) => {
                    return (
                      <ItemExercise key={index} data={exercise} />
                    )
                  })}
                </div>
            </div>

            <div className="footer-pagination">
                <h4>{totalExercisesHours} Horas de exercicios feitos.</h4>
                <h3>Paginação de resultados</h3>
                <div className="pagination">
                  {maxExercise.map((value, index) => {
                    return (
                      <span key={index} onClick={() => getExercises(value)}>{value}</span>
                    );
                  })}
                </div>
            </div>  
      </div>
    </div>
  );
}

export default App;
