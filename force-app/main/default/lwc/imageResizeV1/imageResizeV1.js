import {LightningElement,track} from 'lwc';
import {createRecord} from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import uploadFile from '@salesforce/apex/CreateAccountWithImageResize.uploadFile';

export default class ImageResize extends LightningElement {

    accountName;
    @track fileData;
    @track image;
    @track new_Image;
    
  
    handleCreate() {

        const inputFields = this.template.querySelectorAll('lightning-input');



        const allValid = this.isInputValid(inputFields);




        console.log('allValid---->',allValid)

        if (allValid) {

            const fields = {};

            fields[ACCOUNT_NAME_FIELD.fieldApiName] = this.accountName;



            const accountInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };


            createRecord(accountInput)



                .then(result => {

                    console.log('account created with id: ', result.id);

                  
                    return uploadFile({ recordId: result.id, base64: this.fileData.base64, filename : this.fileData.fileName });



                })

                .then(result => {
                    alert("The Account is created with image");
                    console.log('success!', result);

                })



                .catch(error => {

                    console.log('error', error);

                });

        }

    }

    isInputValid() {
        //New comment
        let showErrorMessage = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                showErrorMessage = false;
            }
        });

        return showErrorMessage;

    }

    handleChangeAccountName(event) {
        if (event.target.name === "accountName") {
            this.accountName = event.target.value;
        }
    }
    openFileUpload(event) {
        //to capture the file data through event
        const file = event.target.files[0];
        //console.log(file)

        //Here we are reading the file and storing in a container reader
        var reader = new FileReader();
        //console.log(reader)

        //once the reader container is loaded
        reader.onload = (event) => {
           
            let fileContents = event.target.result;
            //console.log(fileContents);

            //we are creating a image element to store the image in the container.
            this.image = new Image();

            //the filecontents is then transferred to the src of the image element
            this.image.src = fileContents;

            //once the image completely loads
            this.image.onload = (e) => {

                //here we are capturing the original image width and storing in a imageWidth Conatiner
                var imageWidth = this.image.width;
                console.log(imageWidth)

                //here we are capturing the original image width and storing in a imageHeight Conatiner
                var imageHeight = this.image.height;
                console.log(imageHeight)

                //Here we are checking if the original image width and height greater than 200 
                if (parseInt(imageWidth) > 200 || parseInt(imageHeight) > 200) {

                    //we are creating a canvas for the new image
                    const canvas = document.createElement('canvas');

                    //we are using canvas of 2D
                    let ctx = canvas.getContext('2d');

                    //we are assigning the max width 220 to the container MAX_WIDTH
                    var MAX_WIDTH = 220;

                    //we are assigning the max width 220 to the container MAX_WIDTH
                    var MAX_HEIGHT = 220;

                    //the original image width is stored in a width container 
                    var width = imageWidth;

                    //the original image height is stored in a width container
                    var height = imageHeight;

                    //check if the width is greater than height
                    if (width > height) {
                        //check if width is greater than max width , we are doing this to compress the image width and height according 
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        //check if height is greater than max height , we are doing this to compress the image width and height according
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    //assign original width to the width of the canvas
                    canvas.width = width;
                    console.log('new image width ' ,canvas.width)
                    //assign original height to the height of the canvas
                    canvas.height = height;
                    console.log('new image width ' ,canvas.height)

                    //drwaing the uploaded image on canvas from the origin
                    ctx.drawImage(this.image, 0, 0, width, height);
                    //console.log("ctx" ,ctx)

                    //Here we are converting the canvas of any type to an URL
                    var dataurl = canvas.toDataURL(file.type);
                    console.log("dataurl " ,dataurl)

                    //We are cretaing a new img element to store the resized image
                    this.new_Image = document.createElement('img');

                    //The URL is stored in a src attribute of an image element
                    this.new_Image.src = dataurl;
                    console.log("image src ",this.new_Image.src)

                    //whatever is there in the src attribute of an image element is been stored in resizedImage container
                    var resizedImage = this.new_Image.src;

                    //Here we are splitting the index 1 of an resizedImage and storing in a container base64
                    var base64 = resizedImage.split(',')[1];
        
                    //We are taking the name of the file and base64 value and storing in a fileData container of type object
                    this.fileData = {
                        'fileName': file.name,
                        'base64': base64
                    }
                    console.log('File data---', this.fileData);

           
                    //With the help of querySelector we are slecting the class and we are appending the new image to that element
                    let input = this.template.querySelector(".fileId").appendChild(this.new_Image);

                    console.log(input)

            

             
                }
                
            }



        }
        reader.readAsDataURL(file);
        // console.log(reader)
        



    }

   

}