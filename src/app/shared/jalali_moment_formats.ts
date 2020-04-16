import {MatDateFormats} from '@angular/material/core';

export const JALALI_MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'jYYYY-jMM-jDD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY MMMM'
  }
};

export const MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'l'
  },
  display: {
    dateInput: 'l',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
