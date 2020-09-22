# GregorianHijriCalendarComponent

This component is used to input and  display **Hijri** and **Gregorian** dates.


## USAGE

### Example

```
<gregorian-hijri-calendar></gregorian-hijri-calendar>
```
Or
```
<gregorian-hijri-calendar [gDate]="myDate" (onSelect)="selectedDateChanged($event)" [disabled]="false"></gregorian-hijri-calendar>
```

### Inputs and outputs

- ##### Inputs
    * ###### gDate: (**String** or **Number**) - *Optional*
        - Date written at any format that could be converted into date using ``` New Date(gDate) ``` 
        - Ex: 05/11/2016, Mon Oct 22 2018 13:56:01 GMT+0200 (Eastern European Standard Time), 1540209331211
        - **Date is Gregorian only** even if the calender is working in Hijri. **the Gregorian date auto converted into Hijri inside the component**
        - This date is selected and displayed at the component
        - Default is null or no date selected
        
    * ###### disabled: **boolean** - *Optional*
        - Determines if the user can update the selected date or not
        - Default is false

- ##### Outputs
    * ######  onSelect: **function($event)** - *Optional*
        - Called when user selects new date and takes the new selected date as a paremeter
        - The new selected date is an object contains the Hijri and Gregorian values
        - Ex: 
            ```
            selectedDateChanged(selectedDate) {
                console.log(Hijri, selectedDate.hijri);
                console.log(Gregorian, selectedDate.greg);
            }
            ```


## HOW IT WORKs

### ( Hijri - Gregorian ) view switching

*GregorianHijriCalendarComponent* should display only one calender view Hijri calender or Gregorian calender depends on current application settings.

Template contains two calenders views one for Hijri and one for Gregorian and their visibility is binded to ```isHijri```
 flage at the component. ```*ngIf="!isHijri"``` and ```*ngIf="isHijri"```.

On *GregorianHijriCalendarComponent* initiation a subscription from *SharedSettingsService* is set to assign ```isHijri``` to have the 
current application settings date type and to update it every time application settings changes.

```
this.sharedSettingsService.getSettings().subscribe(
  appSettings => (appSettings.systemDate == "Hijri") ? this.isHijri = true : this.isHijri = false
);
```

### Show hide select date dropdown

##### Show dropdown

On click on the calender input dropdown should be displayed and on click anywhere else dropdown should hide.

Dropdowns visibilities are binded to ```calenderVisibleH``` for Higri calender and ```calenderVisibleG``` for Gregorian calender.

Ex: The Gregorian calender dropdown ```<div #calenderG [hidden]="!calenderVisibleG" class="calender-wrapper">```.

On *GregorianHijriCalendarComponent* initiation both of  ```calenderVisibleH``` and ```calenderVisibleG``` are set to false. so no dropdowns are shown.

To show Gregorian calender function ```showCalenderG()``` is used to set ```calenderVisibleG``` to true so the dropdown is displayed. **But** before 
showing the dropdown it should be ready with the content of the month that contains the current selection if there is selection.
or to the page that contains today if there is no selection.

```
showCalenderG() {
    if(this.disabled)
      return;
    this.getSelectedDay();
    this.calenderVisibleG = true;
}
```

It is the same for Hijri calender but with only changes the flage ```calenderVisibleH``` and the function ```showCalenderH()```

##### Hide dropdown

