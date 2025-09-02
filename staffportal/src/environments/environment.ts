// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//const baseUrl = 'http://localhost:3000/api/';
//const baseUrl = 'https://142.93.222.221:443/'
//const baseUrl = 'https://staffportalupts1.onrender.com/';
//const baseUrl = 'http://142.93.222.221:3000/';
const baseUrl = 'https://api.unifiedpmss.com/apiapi/';
export const environment = {
  production: false,
  apis:{
    getAllUsers: `${baseUrl}user`,
    getUserbyUserName: `${baseUrl}user/getuserbyUserName`,
    getUserbyName: `${baseUrl}user/getuserbyName/`,
    generateToken:`${baseUrl}user/generateToken`,
    createuser: `${baseUrl}user`,
    createproject: `${baseUrl}project`,
    getProjectByName: `${baseUrl}project/getbyprojectName`,
    createemployee: `${baseUrl}employee`,
    getAllProjects: `${baseUrl}project`,
    updateProject: `${baseUrl}project/`,
    getAllEmployees: `${baseUrl}employee`,
    getempbyId: `${baseUrl}employee/`,
    updateEmployee: `${baseUrl}employee/`,
    updatepassword: `${baseUrl}user/`,
    getBalance : `${baseUrl}balance`,
    addBalance : `${baseUrl}balance`,
    getbalbyId : `${baseUrl}balance/getBalancebyEmpId/`,
    getExpenseByEmpId:`${baseUrl}expense/getByEmpId/`,
    getExpensesByEmpId: `${baseUrl}expense/getExpensesByEmpId/`,
    getExpense : `${baseUrl}expense`,
    getExpenseDetails:`${baseUrl}expenseDetails/GetView/`,
    createExpense : `${baseUrl}expense`,
    uploadAttachment : `${baseUrl}attachment`,
    getAttachment:`${baseUrl}attachment/getattachmentbyexpId`,
    getEmpUpdates: `${baseUrl}audittrail/updates/employees`,
    getEmpId : `${baseUrl}employee/getbyempName`,
    getByLookupType: `${baseUrl}lookup/getByLookupType`,
    getallEmpBalance : `${baseUrl}balance/getallEmpBalance`,
    createbalrequest : `${baseUrl}balanceRequest`,
    getbalrequest : `${baseUrl}balanceRequest`,
    getsubmittedbalreq: `${baseUrl}balanceRequest/submitted`,
    updatebalrequest : `${baseUrl}balanceRequest/`,
    getbalrequestbyempid : `${baseUrl}balanceRequest/getRequestbyUserName/`,
    getlastrequestbyempid : `${baseUrl}balanceRequest/getLastRequestByEmpId/`,
    getsubmittedcount : `${baseUrl}balanceRequest/getSubmittedCount`,
    updateexprequest : `${baseUrl}expense/`,
    updateattachCount : `${baseUrl}expense/updateattachCount/`,
    getunApprovedcount : `${baseUrl}getUnApprovedCount`,
    query : `${baseUrl}query`,
    approveWithBalance: `${baseUrl}expense/approveWithBalance`,
    createLabourRecord : `${baseUrl}labourrecord`,
    getLabourRecordByProject : `${baseUrl}labourrecord/getrecordbyproject`,
    downloadAttachment : `${baseUrl}attachment/download/`,
    updaterecordattachCount : `${baseUrl}labourrecord/updateattachCount/`,
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
