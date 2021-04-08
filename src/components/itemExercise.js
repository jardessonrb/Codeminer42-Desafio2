import React, { useState } from 'react';
import { IoRemoveCircleOutline } from 'react-icons/all';
import { deleteExerciseById } from '../controller/apiController';
import '../styles/components/itemexercise.css'

function ItemExercise(props){
    async function removeItemExercise(idItemExercise){
        const res = await deleteExerciseById(idItemExercise);

        if(res.status === "success")
        {
            alert(res.message);
        }else{
            alert(res.message)
        }
    }

    return (
        <div className="container-item-exercise">
            <span>{props.data.duration}h</span>
            <span>{props.data.type_exercise}</span>
            <span>{props.data.date_exercise}</span>
            <button onClick={() => removeItemExercise(props.data.id)}><IoRemoveCircleOutline className="icon"/></button>
        </div>
    );
}


export default ItemExercise;