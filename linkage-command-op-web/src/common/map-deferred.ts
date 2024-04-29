import { Deferred } from 'ts-deferred';

const deffered = new Deferred<void>();

const waitingForMap = async() => {
  return await deffered.promise;
};
const resolveMap = () => {
  deffered.resolve();
};

export { waitingForMap, resolveMap };
