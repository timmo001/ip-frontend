import Action from "./Action";
import Condition from "./Condition";
import GenericObject from "./GenericObject";

export default interface Service {
  id: string;
  name: string;
  description?: string;
  config?: GenericObject;
  conditions: Condition[];
  actions: Action[];
}
