//todo TÜM ELEMENTLERİ SEÇME 
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todolist = document.querySelector(".list-group");
const firstcardbody = document.querySelectorAll(".card-body")[0];
const secondcardbody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearbutton = document.querySelector("#clear-todos");

eventlisteners();       
//tüm yazılan eventleri tek bir fonksiyonda topladık çalışması için.

function eventlisteners (){   
    //tüm event listenerlar

    form.addEventListener("submit",addTodo);  
    // submit olduğu zaman addTodonun çalışmasını söyledik.

    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    //  sayfalar yüklendiğinde tüm todoların local storage dan geri gelmesini sağlamak için DOMContentLoaded submitini ekledik. ve sayfalar yüklendiğinde eklediğimiz todolor geri gelicek.

    secondcardbody.addEventListener("click",deleteTodo);
    // click eventii olduğunda delet todo fonksiyonunu çalışmasını söyledik.
    // cardbody içerisindeo lduğu için totodlar silmek için de onun içerisindeki x butonunu bulmamamız lazım o da secondcardbody içerisinde olduğu için secondcardbody ye click eventi atadık.

    filter.addEventListener("keyup",filterTodos);
    //  filtreleme yi gerçekleştirirseniz bu olay tetiklenir.
    clearbutton.addEventListener("click",clearAllTodos);
    // tüm taslakları temizlemek isterseniz bu gerçekleşir.

}
function clearAllTodos (e){
    if(confirm("tümünü silmek istediğinize eminmisiniz ? ")){
        // arayüzden todoları kaldırma.
        // todolist.innerHTML = ""; yavaş
        while(todolist.firstElementChild != null ){
        todolist.removeChild(todolist.firstElementChild); // döngüye soktuk null değer dönene kadar silmesini söyledik eklediğimiz childları
        }
        localStorage.removeItem("todos");  //local storage dan silme
    }
}
// ! FİLTER EKLEME 
function filterTodos(e){

    const filtervalue = e.target.value.toLowerCase();
    const listİtems = document.querySelectorAll(".list-group-item");
    listİtems.forEach(function(listItem){

        const text = listItem.textContent.toLocaleLowerCase();
        if ( text.indexOf(filtervalue) === -1) {
            // Bulamadı 
            listItem.setAttribute("style","display:none !important");  // bootstrap de display flex verdiğimiz için !important kullandığımızda bunu kesinlikle kullan demek istedik ve filtreleme işlemini gerçekleştirdik.
            
        } 
        else{ 
            listItem.setAttribute("style","display:block");
        }
    });    
}

    function deleteTodo (e){
        // delet todo yazdığımız eventi click olduğunda fonksiyonunu ekledik fonksiyonda eğer dleet todonun targetının class namei fa fa-remove ise 
        //  yani x e click olduğunda e.target ın parentine ulaşmamaız gerekti 
        // biz direk todo yu siliceğimiz için parentine ulaşmak için ilk baş a ya ulaştık ve sonrasında li ye ulaştık 2 kez parent element üsteledik 
        // sonrasında remove() komutu ile silme işlemini yaptık.
        // alert göstermesini istediğimiz için yazdığımız show alert fonksiyon alertini çağırdık ve textini ayarladık. 

       if ( e.target.className === "fa fa-remove"){
            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

            showAlertSucces("success","Todo Başarıyla Silindi");
       }
        

    }


    function loadAllTodosToUI(){

        let todos = getTodosFromStorage();
        // aşşağıda yazdığımız local storage a ekleme fonksiyonunu burda çağırarak her yerde kullanmayi sağladık.



        // foreach ile üzerinde gezinmemizi sağladık. yazdığımız todosları geri çekerek local storage a yüklediğimiz todoları geri getirdik.
        todos.forEach(function(todo){
            addTodotoUI(todo);
            // bu fonksiyon local storage e eklediğimiz tüm todoları sayfamıza geri ekleyerek bize geri göstericek.
        })

    }
    function addTodo (e){           
        //submit olduğunda çalışıcak fonksiyon.
        const newTodo = todoInput.value.trim();  
        //!  Todoinput a girilen değeri value ile aldık .trim() fonksiyonu boşluk bırakılarak yazıldığında bize normal gözükmesini sağlaması için yazdık.
        if(newTodo === ""){   
            //alert ekleme işlemi yapıyoruz new todo boş ise alert göstericek
            showAlertWarning("danger","Lütfen Bir TODO Giriniz.");   
            // alert type and alert text
            /*
            <div class="alert alert-warning" role="alert">
                       EKLENEMEDİ LÜTFEN KONTROL EDİNİZ !
                      </div>
            */
        }

        else {
            addTodotoUI(newTodo);
            addTodoToStorage(newTodo);
            showAlertSucces("success","Todo Başarıyla Eklendi...");
        }

        e.preventDefault();   
         // sayfanın yenilenmesini önledik. en sona eklenir.
        }

        //!             TODOLARI STORAGE DAN SİLME İŞLEMİ ÖNEMLİ
        function deleteTodoFromStorage (deletetodo){
            let todos = getTodosFromStorage();

            todos.forEach(function(todo,index){
                if(todo === deletetodo){
                    todos.splice(index,1) ;  //array den değeri silme metodu storage dan da siliyor. 
                }
            })

            localStorage.setItem("todos",JSON.stringify(todos));
        }

        //!     ALERT FUNCTİON  WARNİNNG
        function showAlertWarning(type,message){

            const alert = document.createElement("div");
            //yeni element oluşturduk..
            alert.className = "alert alert-warning" ; 
            // elemente classname verdik
            alert.textContent = message;
            // yukarıda oluşturduğumuz funciton içerisinde bulunan messağe ı yazdırmasını istedik

            
            firstcardbody.appendChild(alert); 
            //  seçtiğimiz first card body i yeni çocuk ekleyerek appendChild özelliği ile alerti yazdırdık.
            
            //  sett time out metod bu işlem ile alert geldiğinde 2 sn veya 3 sn durmasını istediğimiz kadar kalmasını sağladık.

            setTimeout(function(){
                alert.remove();
            },2000);

            //todo 1 saniye gösterip gitmesi için set timout içerisine funciotn atayıp alert.remove atadık() ve ,1000 ekledik ki 1 saniye sonra silsin              2000 yazarsak 2 sn dir.


        }

        function getTodosFromStorage(){ //storagedan todoları almış olucak


            let todos; 
            // todos adında değişken oluşturduk
            if (localStorage.getItem("todos") === null ){
                todos = [];
            }
            // eğer null değer dönerse todos boş olursa yeni todos oluştur dedik.
            else {
                todos = JSON.parse(localStorage.getItem("todos"));
            }
            return todos;
            // dönmezse yani todos oluşturlmuş ise bu todosu string bir değer gibi storage a eklemesin söyledik. 
        }

        function addTodoToStorage (newTodo){
           let todos = getTodosFromStorage();

           todos.push(newTodo);
           localStorage.setItem("todos",JSON.stringify(todos));

        }

            //!         ALERT SUCCESS
        function showAlertSucces(type,message){

            const alert = document.createElement("div");
            //yeni element oluşturduk..
            alert.className = "alert alert-success" ; 
            // elemente classname verdik
            alert.textContent = message;
            // yukarıda oluşturduğumuz funciton içerisinde bulunan messağe ı yazdırmasını istedik

            
            firstcardbody.appendChild(alert); 
            //  seçtiğimiz first card body i yeni çocuk ekleyerek appendChild özelliği ile alerti yazdırdık.
            
            //  sett time out metod bu işlem ile alert geldiğinde 2 sn veya 3 sn durmasını istediğimiz kadar kalmasını sağladık.

            setTimeout(function(){
                alert.remove();
            },2000);

            //todo 1 saniye gösterip gitmesi için set timout içerisine funciotn atayıp alert.remove atadık() ve ,1000 ekledik ki 1 saniye sonra silsin.


        }

        function addTodotoUI (newTodo){        
             //yukarıda submit olan string değeri list item olarak eklemesini sağlıyıcak todoınputa girilen değeri liste formuna döndürüp ul iöerisine yazıcaz.

                /* <!-- <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>-->  */

            //todo  LİST İTEM OLUŞTURMA
            const listItem = document.createElement("li"); 
            // creat element ile yeni li oluşturduk ul içerisine.
            //todo LİNK OLUŞTURMA
            const link = document.createElement("a");
            //li içerisine yeni a elementi oluşturduk.

            link.href = "#";
            link.className = "delete-item";
            link.innerHTML = "<i class = 'fa fa-remove'></i>";

            listItem.className = "list-group-item d-flex justify-content-between";

            //todo  TEXT NODE EKLEME 

            listItem.appendChild(document.createTextNode(newTodo));
            listItem.appendChild(link);




            // TODO LİST E LİST İTEM I EKLEME
            todolist.appendChild(listItem);

            todoInput.value = "";
            //input değer girildiğinde değeri orda bırakmak için sildik.

        }