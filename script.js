
 

 // Initialize Firebase


 // Get a reference to the storage service
 const storage = getStorage();

 // File input element
 const fileInput = document.getElementById('file-input');

 // Upload button
 const uploadBtn = document.getElementById('upload-btn');

 // Category elements
 const imageCategory = document.getElementById('image-category');
 const videoCategory = document.getElementById('video-category');
 const documentCategory = document.getElementById('document-category');

 // File lists
 const imageList = document.getElementById('image-list');
 const videoList = document.getElementById('video-list');
 const documentList = document.getElementById('document-list');

 // Define variables for dates lists
 const imageDates = document.getElementById('image-dates');
 const videoDates = document.getElementById('video-dates');
 const documentDates = document.getElementById('document-dates');

 // Function to update file count and list
 const updateFileCountAndList = () => {
 // Reference to the root of the storage
 const storageRef = ref(storage);

 // Get the list of all items in the storage
 listAll(storageRef)
     .then((res) => {
     res.items.forEach((itemRef) => {
         // Get the file extension from the item's name
         const fileExtension = itemRef.name.split('.').pop().toLowerCase();

         // Get the metadata for the item
         getMetadata(itemRef)
         .then((metadata) => {
             // Extract the upload date from the metadata
             const uploadDate = metadata.timeCreated;

             // Format the upload date (example format: "June 11, 2023")
             const formattedUploadDate = new Date(uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

             // Get the download URL for the item
             getDownloadURL(itemRef)
             .then((downloadURL) => {
                 // Update the file count and list based on the file extension
                 switch (fileExtension) {
                 case 'jpg':
                 case 'jpeg':
                 case 'png':
                     imageList.innerHTML += `<li><a href="${downloadURL}" target="_blank">${itemRef.name}</a></li>`;
                     imageDates.innerHTML += `<li>${formattedUploadDate}</li>`;
                     document.getElementById('image-count').textContent = parseInt(document.getElementById('image-count').textContent) + 1;
                     break;
                 case 'mp4':
                 case 'avi':
                 case 'mov':
                     videoList.innerHTML += `<li><a href="${downloadURL}" target="_blank">${itemRef.name}</a></li>`;
                     videoDates.innerHTML += `<li>${formattedUploadDate}</li>`;
                     document.getElementById('video-count').textContent = parseInt(document.getElementById('video-count').textContent) + 1;
                     break;
                 case 'pdf':
                 case 'doc':
                 case 'txt':
                     documentList.innerHTML += `<li><a href="${downloadURL}" target="_blank">${itemRef.name}</a></li>`;
                     documentDates.innerHTML += `<li>${formattedUploadDate}</li>`;
                     document.getElementById('document-count').textContent = parseInt(document.getElementById('document-count').textContent) + 1;
                     break;
                 default:
                     break;
                 }
             })
             .catch((error) => {
                 console.error('Error getting download URL:', error);
             });
         })
         .catch((error) => {
             console.error('Error getting metadata:', error);
         });
     });
     })
     .catch((error) => {
     console.error('Error fetching file count:', error);
     });
 };

 // Event listener for file upload
 uploadBtn.addEventListener('click', () => {
 const file = fileInput.files[0];
 const storageRef = ref(storage, file.name);

 // Upload the file to Firebase Storage
 uploadBytes(storageRef, file)
     .then((snapshot) => {
     console.log('File uploaded successfully!');
     updateFileCountAndList();
     })
     .catch((error) => {
     console.error('Error uploading file:', error);
     });
 });

 // Load file count and list on page load
 window.addEventListener('load', updateFileCountAndList);


 // Toggle file list visibility on category click
 imageCategory.addEventListener('click', () => {
   imageList.style.display = (imageList.style.display === 'none') ? 'block' : 'none';
 });
 
 videoCategory.addEventListener('click', () => {
   videoList.style.display = (videoList.style.display === 'none') ? 'block' : 'none';
 });
 
 documentCategory.addEventListener('click', () => {
   documentList.style.display = (documentList.style.display === 'none') ? 'block' : 'none';
 });
