import workLogService from "./worklog.service.js";

const handleTimer = (req, res) => workLogService.handleTimer(req, res);

const getLogsByEmployee = (req, res) => workLogService.getEmployeeLogs(req, res);

const getLogsByTask = (req, res) => workLogService.getTaskLogs(req, res);

export default {
  handleTimer,
  getLogsByEmployee,
  getLogsByTask
};
