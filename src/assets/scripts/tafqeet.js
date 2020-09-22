'use strict';

(function (){


    // var out$ = typeof exports != 'undefined' && exports || typeof define != 'undefined' && {} || this || window;
    // if (typeof define !== 'undefined') define('tafqeet', [], function () {
    //   return out$;
    // });

    define(
    'tafqeet',
    [
    ], function() {
        return tafqeet;
    });

    function tafqeet (number, tale = false, mainUnit = "ريال", subUnit = "هللة", mainUnits = "ريالات", subUnits = "هللات") {

        number = Number(number);
        if(Number.isNaN(number))
            return "";

        var mainNumber = Math.floor(number);
        var fraction = Number.parseFloat((number-mainNumber).toPrecision(2))*100;
        
        var mainText = sHorof(mainNumber);
        var fractionText = sHorof(fraction);
        
        if( number > 2 && number < 11 ) {
            mainUnit = mainUnits;
        }
        if( fraction > 2 && fraction < 11 ) {
            subUnit = subUnits;
        }

        if( mainText != "" && fraction > 0 ) {
            var result = mainText + " " + mainUnit + " و " + fractionText + " " + subUnit;
        } else if( mainText === "" && fraction !=0 ) {
            var result = fractionText + " " + subUnit;
        } else if(mainText != "" && fraction === 0 ){
            var result = mainText + " " + mainUnit;
        }else if( mainText === "" && fraction === 0 ) {
            return "";
        }
        if(tale) {
            return "# فقط " + result + " لا غير #";
        } else {
            return result;
        }
    }

    function sHorof(number) {

        var letter1 = "";
        var letter2 = "";
        var letter3 = "";
        var letter4 = "";
        var letter5 = "";
        var letter6 = "";
        
        
        number = number.toString();
        var c = "000000000000".slice(0, 12-number.length) + number;

        var c1 = Number.parseInt(c.slice(11));
        switch (c1) {
            case 1: 
                letter1 = "واحد"
                break;
            case 2: 
                letter1 = "اثنان"
                break;
            case 3: 
                letter1 = "ثلاثة"
                break;    
            case 4: 
                letter1 = "اربعة"
                break;
            case 5: 
                letter1 = "خمسة"
                break;
            case 6: 
                letter1 = "ستة"
                break;
            case 7: 
                letter1 = "سبعة"
                break;
            case 8: 
                letter1 = "ثمانية"
                break;
            case 9: 
                letter1 = "تسعة"
                break;
        }

        var c2 = Number.parseInt(c.slice(10, 11));
        switch (c2) {
            case 1: 
                letter2 = "عشر"
                break;
            case 2: 
                letter2 = "عشرون"
                break;
            case 3: 
                letter2 = "ثلاثون"
                break;    
            case 4: 
                letter2 = "اربعون"
                break;
            case 5: 
                letter2 = "خمسون"
                break;
            case 6: 
                letter2 = "ستون"
                break;
            case 7: 
                letter2 = "سبعون"
                break;
            case 8: 
                letter2 = "ثمانون"
                break;
            case 9: 
                letter2 = "تسعون"
                break;
        }
 
        if( letter1 != "" && c2 > 1) {
            letter2 = letter1 + " و " + letter2;
        }
        if( letter2 === "" ) {
            letter2 = letter1;
        }
        if( c1 === 0 && c2 === 1 ) {
            letter2 = letter2 + "ة";
        }
        if( c1 === 1 && c2 === 1 ) {
            letter2 = "احدى عشر";
        }
        if( c1 === 2 && c2 === 1 ) {
            letter2 = "اثنى عشر";
        }
        if( c1 > 2 && c2 === 1 ) {
            letter2 = letter1 + " " + letter2;
        }
        
        var c3 = Number.parseInt(c.slice(9, 10));
        if( c3 === 1 ) {
            letter3 = "مائة";
        } else if( c3 === 2 ) {
            letter3 = "مئتان";
        } else if ( c3 > 2 ) {
            letter3 = sHorof(c3).slice(0, sHorof(c3).length - 1) + "مائة";
        }
        
        if( letter3 != "" && letter2 != "" ) {
            letter3 = letter3 + " و " + letter2;
        }
        if( letter3 === "" ) {
            letter3 = letter2;
        }


        var c4 =  Number.parseInt(c.slice(6, 9));
        if( c4 === 1 ) {
            letter4 = "الف";
        } else if ( c4 === 2 ) {
            letter4 = "الفان";
        } else if ( c4 >= 3 && c4 <= 10 ) {
            letter4 = sHorof(c4) + " آلاف";
        } else if ( c4 > 10 ) {
            letter4 = sHorof(c4) + " الف";
        }

        if( letter4 != "" &&  letter3 != "" ) {
            letter4 = letter4 + " و " + letter3;
        }
        if( letter4 == "" ) {
            letter4 = letter3;
        }


        var c5 =  Number.parseInt(c.slice(3, 6));
        if( c5 === 1 ) {
            letter5 = "مليون";
        } else if ( c5 === 2 ) {
            letter5 = "مليونان";
        } else if ( c5 >= 3 && c5 <= 10 ) {
            letter5 = sHorof(c5) + " ملايين"
        } else if ( c5 > 10 ) {
            letter5 = sHorof(c5) + " مليون";
        }

        if( letter5 != "" && letter4 != "" ) {
            letter5 = letter5 + " و " + letter4;
        } else if ( letter5 === "" ) {
            letter5 = letter4;
        }

        
        var c6 =  Number.parseInt(c.slice(0, 3));
        if( c6 === 1 ) {
            letter6 = "مليار";
        } else if ( c6 === 2 ) {
            letter6 = "ملياران";
        } else if ( c6 > 2 ) {
            letter6 = sHorof(C6) + " مليار";
        }

        if( letter6 != "" && letter5 != "" ) {
            letter6 = letter6 + " و " + letter5;
        } else if ( letter6 === "" ) {
            letter6 = letter5;
        }

        return letter6;
    }


}())
