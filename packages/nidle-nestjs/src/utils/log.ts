import dayjs from 'dayjs';
import _ from 'lodash';

// 计算持续时间
export function getDuration(begin, end) {
  const beginTime = dayjs(begin);
  const endTime = dayjs(end);
  return endTime.diff(beginTime);
}

function getSteps(logs, steps, from = 0, end) {
  const stepStartIdx = _.findIndex(logs, { progress: 'STEP START' }, from);

  if (stepStartIdx > -1) {
    const stepStart = logs[stepStartIdx];
    const step: Record<string, any> = {
      name: stepStart.name,
      taskName: stepStart.taskName,
      startTime: stepStart.time,
    };

    const stepEndIdx = _.findIndex(
      logs,
      function (item: Record<string, any>) {
        return (
          (item.progress === 'STEP ERROR' ||
            item.progress === 'STEP COMPLETE') &&
          item.name === step.name
        );
      },
      stepStartIdx,
    );

    // 拼接详情
    const list = logs.slice(
      stepStartIdx + 1,
      stepEndIdx > -1 ? stepEndIdx : logs.length,
    );
    step.detail = list
      .map((item) => item.detail)
      .join('')
      .replace(/\\r/g, '\n');

    steps.push(step);

    if (stepEndIdx > -1) {
      const stepEnd = logs[stepEndIdx];
      step.endTime = stepEnd.time;
      step.duration = getDuration(step.startTime, step.endTime);

      if (stepEnd.progress === 'STEP ERROR') {
        step.status = 'FAIL';
        step.detail += stepEnd.error.stack;
      }

      if (stepEndIdx + 1 >= end) {
        return;
      }

      getSteps(logs, steps, stepEndIdx, end);
    } else {
      step.duration = getDuration(step.startTime, logs[logs.length - 1].time);
      return;
    }
  } else {
    return;
  }
}

export function transform(logs, stages, from = 0) {
  const stageStartIdx = _.findIndex(logs, { progress: 'STAGE START' }, from);

  if (stageStartIdx > -1) {
    const stageStart = logs[stageStartIdx];
    const stage: Record<string, any> = {
      name: stageStart.name,
      startTime: stageStart.time,
      steps: [],
    };

    const stageEndIdx = _.findIndex(
      logs,
      function (item: Record<string, any>) {
        return (
          (item.progress === 'STAGE ERROR' ||
            item.progress === 'STAGE COMPLETE') &&
          item.name === stage.name
        );
      },
      stageStartIdx,
    );
    getSteps(
      logs,
      stage.steps,
      stageStartIdx,
      stageEndIdx > -1 ? stageEndIdx : logs.length,
    );

    stages.push(stage);

    if (stageEndIdx > -1) {
      const stageEnd = logs[stageEndIdx];
      stage.endTime = stageEnd.time;
      stage.duration = getDuration(stage.startTime, stage.endTime);

      transform(logs, stages, stageEndIdx);
    } else {
      stage.duration = getDuration(stage.startTime, logs[logs.length - 1].time);
      return;
    }
  } else {
    return;
  }
}
