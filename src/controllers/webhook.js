import axios from "axios";
import environments from "../config/environments.js";
import { getTokens } from "../services/get-tokens.js";
import { getAmoStudent, mountStudentData } from "../repositories/amocrm.js";
import catchFn from "../utils/catch.js";
import { getStudentList, searchFromTrash, restoreFromTrash, createStudent, findGroupId, addToGroup, checkExistsInGroup, activateStudent } from "../repositories/modme.js";


export const webHook = async (req, res) => {
  try {
    const studentData=await mountStudentData(req,res)
    if(!studentData){
        return true;
    }
    
    let studentId=await getStudentList(studentData)

    if(!studentId){
      let archivedStId=await searchFromTrash(studentData)

      if(!archivedStId){
        await createStudent(studentData)
      }else{
        await restoreFromTrash(archivedStId);
      }
    }

    studentId = await getStudentList(studentData);
    let groupId=await findGroupId(studentData.group)
    const exists=await checkExistsInGroup(groupId, studentId, studentData.added_date)
    if(exists){
      return true
    }
    return false

  } catch (error) {
    catchFn(error, 'Error with webhook')
  }
};

export const activate=async (req, res)=>{
  try {
    const studentData = await mountStudentData(req, res, 'activate');
    if (!studentData) {
      return true;
    }
     let studentId = await getStudentList(studentData);
    let groupId = await findGroupId(studentData.group);
    const exists = await checkExistsInGroup(
      groupId,
      studentId,
      studentData.added_date
    );
     if (exists) {
      await activateStudent(groupId, studentId, studentData.activated_date)
       return true;
     }
     return false;
  } catch (error) {
      catchFn(error, 'Error with activate in group hook')
  };
  
}

