import * as WorkLogService from "./worklog.service.js";

export const startWork = async (req, res) => {
  try {
    const workLog = await WorkLogService.startWork(req.user.id, req.body.taskId);
    res.status(201).json({ success: true, workLog });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const addBreak = async (req, res) => {
  try {
    const workLog = await WorkLogService.addBreak(req.params.id, req.body);
    res.status(200).json({ success: true, workLog });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const endWork = async (req, res) => {
  try {
    const workLog = await WorkLogService.endWork(req.params.id);
    res.status(200).json({ success: true, workLog });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const note = {
      text: req.body.text,
      addedBy: req.user.id,
      addedByModel: req.user.role
    };
    const workLog = await WorkLogService.addNote(req.params.id, note);
    res.status(200).json({ success: true, workLog });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getWorkLogsByEmployee = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await WorkLogService.getWorkLogsByEmployee(req.user.id, new Date(startDate), new Date(endDate));
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getAllWorkLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await WorkLogService.getAllWorkLogs(new Date(startDate), new Date(endDate));
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
