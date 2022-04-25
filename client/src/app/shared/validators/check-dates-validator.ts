// @ts-disabled
// @ts-ignore
import {FormControl, FormGroup} from '@angular/forms';

export function checkDates(sdateFieldName: string, edateFieldName: string): any{
  return (formGroup: FormGroup) => {

    const checkin = formGroup.controls[sdateFieldName] as FormControl;
    const checkout = formGroup.controls[edateFieldName] as FormControl;

    if (checkin.errors) {
      return;
    }

    if (checkout.errors && !checkout.errors.match) {
      return;
    }

    if (Date.parse(checkin.value) > Date.parse(checkout.value)) {
      checkout.setErrors({ match: true });
    } else {
      checkout.setErrors(null);
    }
  };
}
