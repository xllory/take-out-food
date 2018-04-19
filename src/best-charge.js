function bestCharge(selectedItems) {

  var allItems = loadAllItems();
  var saveItems = loadPromotions();
  var cartItems=buildCartItems(selectedItems,allItems);
  var subTotals=buildSubTotal(cartItems);
  var itemPromitions=getPromitionDiscount(subTotals,saveItems,cartItems);
   console.log(itemPromitions);
  var print=buildItemsReceipt(itemPromitions,cartItems);
  return print;

}
function buildCartItems(selectedItems,allItems) {//价格和item=>cartItems
  var cartItems=[];
  for (var i = 0; i < selectedItems.length; i++) {
    var splitit = selectedItems[i].split(" x ");
    var itemId = splitit[0].trim();
    var count = parseInt(splitit[1]);
    var item = allItems.find(function (item) {
      if (item.id === itemId)
        return item;
    });
    cartItems.push({item, count});
    }
  return cartItems;
}
function buildSubTotal(cartItems) {//cartItems和sum计=>subTotal
  var total = 0;
  var subTotals = [];
  for (var i = 0; i < cartItems.length; i++) {
    total += cartItems[i].item.price * cartItems[i].count;
    }
  return {cartItems, total};
}
function getPromitionDiscount(subTotals,saveItems,cartItems) {
  var saveType1;
  var saveType2 = 0;
  var promitionItems = [];
 // console.log(subTotals);
  if (subTotals.total >= 30) {
    saveType1 = 6;
    var promitionType1 = saveItems[0].type;
  }//使用第一种的优惠金额以及优惠方式
  var save2Items=saveItems[1].items;
  var item = cartItems.map(function (value) {
    return value.item;
  });
  for(var i=0;i<item.length;i++){
      if(save2Items.some(function(value){
        return value===item[i].id}))
      {
        saveType2 += item[i].price/2;
        promition=item[i].name;
        promitionItems.push(promition);
      }
      var promitionType2=saveItems[1].type;
  }//第二种的优惠金额以及优方式惠
 // console.log(subTotals);
   return saveType1>=saveType2 ? {subTotal:subTotals,save : saveType1, promitionType : promitionType1} :
     {
       subTotal:subTotals,
       save : saveType2,
       promitionType : promitionType2,
       promitionItems : promitionItems
     };
}
function buildItemsReceipt(itemPromitions,cartItems) {
  var item=cartItems.map(function(value){
    return value.item;
  });
  var printf="============= 订餐明细 =============\n"
  for(var i=0;i<item.length;i++){
  printf+= item[i].name+" x "+cartItems[i].count+ ' = '+item[i].price*cartItems[i].count+"元"+'\n';
  }
  printf+= "-----------------------------------\n";

  if(itemPromitions.promitionType=="满30减6元")
  { printf+="使用优惠:"+"\n";
    printf+=itemPromitions.promitionType+","+"省"+itemPromitions.save+"元"+"\n";
    printf+= "-----------------------------------\n";
  }
  if(itemPromitions.promitionType=="指定菜品半价"&&itemPromitions.save>0) {
    printf += "使用优惠:" + "\n";
    printf += itemPromitions.promitionType + "(" + itemPromitions.promitionItems + ")" +","+ "省" + itemPromitions.save + "元" + "\n";
    printf += "-----------------------------------\n";
  }
  var finalPrice=itemPromitions.subTotal.total-itemPromitions.save;
  printf+="总计:"+finalPrice+"元"+"\n";
  printf+="===================================";
  return printf;
}
