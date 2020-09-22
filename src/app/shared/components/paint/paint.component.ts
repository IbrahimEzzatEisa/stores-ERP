import { Component, OnInit,ViewChild,ElementRef,Output,EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
  ) { }
  mousePressed = false;
  lastX; lastY;
  currentColor: string;
  ctx: CanvasRenderingContext2D;
  @ViewChild('myCanvas') MyCanvas:ElementRef;
  @ViewChild('colorPicker') colorPicker;
  @ViewChild('selWidth') selWidth;
  @ViewChild('container') canvasContainer;

  @ViewChild('delete') deleteModal;
  @ViewChild('edit') editModal;
  @ViewChild('paint') paint:ElementRef;
  parentWidth;

  xOff; yOff;
  //imageConverttoBase64 and save
  pic;                base64Image:any;
  block:any;          contentType:any;
  realData:any;       blob:any;
  formDataToUpload;
  
  canvas;
  selValue;           sel=false;
  startX;              startY;
  freeDraw=false;      rectDraw=false;
  circleDraw=false;    eraseDraw=false;
  snap1:any;           pointer=0;
  storedCtx;          snapShotStack:Array<any>=[];
  once=false;

  @Output() onSave = new EventEmitter();
  @Input() height;
  @Input() width;
  ngOnInit() {
    this.canvas=this.MyCanvas.nativeElement; 
    if(!this.snapShotStack)
      this.snapShotStack = [];
      this.freeD();
  }
  ngAfterViewInit() {
    this.ctx = (this.MyCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    
    let snap1=this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    this.snapShotStack.push(snap1);
    this.pointer++;
    this.onResize();
    
    this.parentWidth=parseInt(this.paint.nativeElement.parentNode.style.width);
    console.log(this.parentWidth);
    if(this.width=="auto")
      this.ctx.canvas.width=this.parentWidth;
    else
      this.ctx.canvas.width=this.width||1500;
    this.ctx.canvas.height=this.height||+"600";
  }
  mouseDown(event){
    event.stopPropagation();
    event.preventDefault();
    if(event.type=="touchstart")
      {
        event=event.touches[0];
      }
    else
    event=event;
    this.mousePressed = true;
    this.xOff=this.getOffsetLeft(this.MyCanvas.nativeElement);
    this.yOff=this.MyCanvas.nativeElement.getBoundingClientRect().top;
    this.startX=event.clientX-this.xOff;
    this.startY=event.clientY-this.yOff;
    if(this.freeDraw)
      this.Draw(event.clientX-this.xOff, event.clientY-this.yOff, false);
    else if(this.rectDraw)
      {
        this.storedCtx = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
      }
    else if(this.circleDraw)
      {
        this.storedCtx = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
      }
  }
  mouseMove(event){
    event.stopPropagation();
    event.preventDefault();
    if(event.type=="touchmove")
      event=event.touches[0];
    else
      event=event;

    
    var width=event.clientX-this.xOff-this.startX;
    var height=event.clientY-this.yOff-this.startY;
    this.ctx.strokeStyle = this.colorPicker.nativeElement.value;
    if(this.sel)
      {
        this.ctx.strokeStyle=this.selValue;
      }
    this.ctx.lineWidth = this.selWidth.nativeElement.value;
   if(this.mousePressed)
    {
      this.yOff=this.MyCanvas.nativeElement.getBoundingClientRect().top;
      
      if(this.freeDraw)
        {
          this.ctx.globalCompositeOperation="source-over";
          this.Draw(event.clientX-this.xOff, event.clientY-this.yOff, true);
        }
      else if(this.rectDraw)
        {
          this.ctx.globalCompositeOperation="source-over";
            this.ctx.putImageData(this.storedCtx,0,0);
            this.ctx.strokeRect(this.startX,this.startY,width,height);
        }
        else if(this.circleDraw)
          {
            this.ctx.globalCompositeOperation="source-over";
            this.ctx.putImageData(this.storedCtx,0,0);
            this.Circle(width);
          }
          else if (this.eraseDraw){
            this.ctx.globalCompositeOperation="destination-out";
            this.Erase(event.clientX-this.xOff,event.clientY-this.yOff,this.selWidth.nativeElement.value);
          }
    }
  }
  addToSnapShots(snapShot) {
    this.snapShotStack = this.snapShotStack.slice(0, this.pointer);
    this.snapShotStack.push(snapShot);
    this.pointer++;
  }
  getPrevFromSnapShots() {
    if( this.snapShotStack.length>1)
    {
      if(!this.once)
      {
        if( this.pointer > 0 ) {
          this.pointer=this.pointer-2;
        }
        this.once=true;
      }
    else{
      if( this.pointer > 0 ) 
        this.pointer--;
    }
    let snapShot = this.snapShotStack[this.pointer];
    return snapShot;
  }
  else
    return;
  }
  getNextFromSnapShots() {
    if(this.pointer != this.snapShotStack.length)
      {
        if( this.pointer < this.snapShotStack.length-1 ) 
        this.pointer++;
        let snapShot = this.snapShotStack[this.pointer];
        return snapShot;
        }
        else
          return;
  }
  mouseUp(event){
    event.preventDefault();
    event.stopPropagation();
    if(event.type=="touchend")
      event=event.touches[0];
    else
      event=event;
    
    let snap1=this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    this.addToSnapShots(snap1);
    this.mousePressed = false;
  }
  mouseLeave(event){
    event.preventDefault();
    event.stopPropagation();
    if(event.type=="touchend")
      event=event.touches[0];
    else
      event=event;
    
    this.mousePressed = false;
  }
  Draw(x, y, isDown) {
    if (isDown) {
        this.ctx.beginPath();
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
  this.lastX = x;       this.lastY = y;
}
  Circle(width)
  {
    this.ctx.beginPath();
    this.ctx.arc(this.startX, this.startY, Math.abs(width), 0, 2 * Math.PI, false);
    this.ctx.stroke();
    this.ctx.beginPath();
  }
  Erase(x,y,size){
    this.ctx.beginPath();
    this.ctx.arc(x,y,size*3,0,Math.PI*2,false);
    this.ctx.fill();
    this.ctx.beginPath();
  }
  unDo(){
    this.ctx.putImageData(this.getPrevFromSnapShots(),0,0);
  }
  reDo(){
    this.ctx.putImageData(this.getNextFromSnapShots(),0,0);
  }
  disableUnDo(){
    if( this.snapShotStack.length<=1||this.pointer==0)
      return true;
    else
      return false;
  }
  disableReDo(){
    if( this.pointer == this.snapShotStack.length||this.pointer == this.snapShotStack.length-1)
      return true;
    else
      return false;
  }
  getOffsetLeft( elem )
  {
      var offsetLeft = 0;
      do {
        if ( !isNaN( elem.offsetLeft ) )
        {
            offsetLeft += elem.offsetLeft;
        }
      } while( elem = elem.offsetParent );
      return offsetLeft;
  }
  removeDraw()
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.snapShotStack=[];
    let snap1=this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    this.snapShotStack.push(snap1);
    this.pointer=1;
  }
  saveDraw(){
    this.pic = this.MyCanvas.nativeElement.toDataURL("image/png");
    this.base64Image=this.pic.replace(/^data:image\/(png|jpg);base64,/, "");
    this.blob = this.b64toBlob(this.base64Image, "image/png",'');
    console.log("blob",this.blob);
    this.onSave.emit(this.blob);
  }

b64toBlob(b64Data, contentType, sliceSize){
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }
var blob = new Blob(byteArrays, {type: contentType});
return blob;
}
setCurrentColor() {
  this.currentColor = this.colorPicker.nativeElement.value;
}
selColor(value)
{this.selValue=value;
  this.sel=true;
  this.colorPicker.nativeElement.value=this.selValue;
  this.setCurrentColor();
}
  // save (blob) {
  //   // this.activeModal.close(blob);
  //  }
   close () {
    //  this.openConfirmSave(false);
   }
   freeD(){
      this.freeDraw=true;
      this.rectDraw=false;
      this.circleDraw=false;
      this.eraseDraw=false;
      this.setCurrentColor();
      this.canvas.style.cursor="url('../../../../assets/imgs/Pencil-Pointer.png'), auto";
   }
   rect(){
    this.canvas.style.cursor="crosshair";
    this.freeDraw=false;
    this.rectDraw=true;
    this.circleDraw=false;
    this.eraseDraw=false;
    this.setCurrentColor();
   }
   circle(){
    this.canvas.style.cursor="crosshair";
    this.freeDraw=false;
    this.rectDraw=false;
    this.circleDraw=true;
    this.eraseDraw=false;
    this.setCurrentColor();
   }
   selErase(){
    this.canvas.style.cursor="crosshair";
    this.freeDraw=false;
    this.rectDraw=false;
    this.circleDraw=false;
    this.eraseDraw=true;
   }
   onResize() {
    if(this.width=="auto")
      this.ctx.canvas.width=this.parentWidth;
    }
    openConfirmSave() {
      const modalRef = this.modalService.open(this.editModal);
    }
    openConfirmDelete() {
      const modalRef = this.modalService.open(this.deleteModal);
    }
    ignore () {
     this.modalService.dismissAll();
   }
   save () {
    this.saveDraw();
    this.modalService.dismissAll();
   }
  remove() {
    this.removeDraw();
    this.modalService.dismissAll();
   }

}
