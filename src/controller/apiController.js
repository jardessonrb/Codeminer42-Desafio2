import baseApi from '../services/api';
import * as Yup from 'yup';

export async function getExercisesByPagination(page = 1, limit = 6){
    const url = `exercises?_sort=date_exercise&_order=desc&_page=${page}&_limit=${limit}`;
    const maxExercise = await getArrayPagination(limit);

    const res = await baseApi.get(url).then(response => {
        const total = totalHouras(response.data);
        return {status: "success", response: response.data, message: "Buscado com sucesso", max: maxExercise, total: total};
    }).catch(err => {
        return {status: "error", response: err, message: "Erro ao buscar na api.", total: 0};
    })
    
    return res;
}

export async function getAllTypesExercises(){
    const res = await baseApi.get("typeExercise").then(response => {
        return {status: "success", response: response.data, message: ""};
    }).catch(error => {
        return {status: "error", response: error, message: "Erro interno"};
    });


    return res;
}

export async function deleteExerciseById(idExercise){
    const url = `exercises/${idExercise}`;

    const schema = Yup.object().shape({
        idExercise: Yup.number().required("O identificador é obrigatório")
    });

    const idExerciseObject = {
        idExercise: Number(idExercise)
    }

    try {
        await schema.validate(idExerciseObject, {
            abortEarly: false
        });
    } catch (error) {
        return {status: "error", response: error.errors, message: "Erro ao deletar o exercício"};
    }
    
    const res = await baseApi.delete(url).then(response => {
        return {status: "success", response: response.data, message: "Exercício deletado com sucesso"};

    }).catch(err => {

        return {status: "error", response: err, message: "Erro ao deletar o exercício"};
    });
    
    return res;
}

export async function saveExercise(dataExercise){
    const { durationExercise, typeExercise, dateExercise} = dataExercise;
    const data = {
        type_exercise: typeExercise,
        duration: Number(durationExercise),
        date_exercise: dateExercise
    }

    const schema = Yup.object().shape({
        type_exercise: Yup.string().required("Tipo de exericio é obrigatório"),
        duration: Yup.number().positive("O número não pode ser menor ou igual a 0(zero)"),
        date_exercise: Yup.date().required("A data é obrigatória")
    });


    try {
        await schema.validate(data, {
            abortEarly: false
        });
        
    } catch (error) {
        return {status: "error", error: error.errors, message: "Erro no preenchimento dos campos"}
    }


    
    const res = await baseApi.post("exercises", data).then( response => {
        return {status: "success", response: response.status, message: "Exercício criado com sucesso"};
        
    }).catch(err => {
        
        return {status: "error", response: err, message: "Erro ao criar o exercício"};
    });
    
    return res;
}

async function getArrayPagination(limit){
    const arrayPagination = [];
    await baseApi.get("exercises").then(response => {
        for (let i = 1; i <= Math.ceil(response.data.length / limit); i++) {
            arrayPagination.push(i);
        }
    }).catch(err => {
        return;
    });
    
    
    return arrayPagination;
}

function totalHouras(data){
    let total = 0;
    const hours = data.map( exercise => {
        total += Number(exercise.duration);
    });


    return total;
}
