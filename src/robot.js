/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * Gomoku robot whic was by: http://blog.csdn.net/show_me_the_world/article/details/48886027
 */
function Robot(chessBoard) {
  this.chessBoard = chessBoard;
}

Robot.prototype = {
  /**五子棋AI 
   *思路：对棋盘上的每一个空格进行估分，电脑优先在分值高的点落子 
   * 棋型： 
   * 〖五连〗只有五枚同色棋子在一条阳线或阴线上相邻成一排 
   * 〖成五〗含有五枚同色棋子所形成的连，包括五连和长连。 
   * 〖活四〗有两个点可以成五的四。 
   * 〖冲四〗只有一个点可以成五的四。 
   * 〖死四〗不能成五的四。 
   * 〖三〗在一条阳线或阴线上连续相邻的5个点上只有三枚同色棋子的棋型。 
   * 〖活三〗再走一着可以形成活四的三。 
   * 〖连活三〗即：连的活三（同色棋子在一条阳线或阴线上相邻成一排的活三）。简称“连三”。 
   * 〖跳活三〗中间隔有一个空点的活三。简称“跳三”。 
   * 〖眠三〗再走一着可以形成冲四的三。 
   * 〖死三〗不能成五的三。 
   * 〖二〗在一条阳线或阴线上连续相邻的5个点上只有两枚同色棋子的棋型。 
   * 〖活二〗再走一着可以形成活三的二。 
   * 〖连活二〗即：连的活二（同色棋子在一条阳线或阴线上相邻成一排的活二）。简称“连二”。 
   * 〖跳活二〗中间隔有一个空点的活二。简称“跳二”。 
   * 〖大跳活二〗中间隔有两个空点的活二。简称“大跳二”。 
   * 〖眠二〗再走一着可以形成眠三的二。 
   * 〖死二〗不能成五的二。 
   * 〖先手〗对方必须应答的着法，相对于先手而言，冲四称为“绝对先手”。 
   * 〖三三〗一子落下同时形成两个活三。也称“双三”。 
   * 〖四四〗一子落下同时形成两个冲四。也称“双四”。 
   * 〖四三〗一子落下同时形成一个冲四和一个活三。 
   * 分值表 
   * 成5:100000分 
   * 活4：10000分 
   * 活3+冲4:5000分 
   * 眠3+活2：2000分 
   * 眠2+眠1:1分 
   * 死棋即不能成5的是0分 
   * @return {[type]} [description] 
   */
  getPosition: function() {
    var a = new Array(2);
    var score = 0;
    for (var x = 0; x < 15; x++) {
      for (var y = 0; y < 15; y++) {
        if (this.chessBoard.chessData[x][y] == 0) {
          if (this.judge(x, y) > score) {
            score = this.judge(x, y);
            a[0] = x;
            a[1] = y;
          }
        }
      }
    }
    return a;
  },

  judge: function(x, y) {
    var a = parseInt(this.leftRight(x, y, 1)) + parseInt(this.topBottom(x, y, 1)) + parseInt(this.rightBottom(x, y, 1)) + parseInt(this.rightTop(x, y, 1)) + 100; //判断白棋走该位置的得分  
    var b = parseInt(this.leftRight(x, y, 2)) + parseInt(this.topBottom(x, y, 2)) + parseInt(this.rightBottom(x, y, 2)) + parseInt(this.rightTop(x, y, 2)); //判断黑棋走该位置的得分  
    var result = a + b;
    // console.log("我计算出了" + x + "," + y + "这个位置的得分为" + result);  
    return result; //返回黑白棋下该位置的总和  
  },

  leftRight: function(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑  
    var live = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
      arr[i] = new Array(15);
      for (var j = 0; j < 15; j++) {
        arr[i][j] = this.chessBoard.chessData[i][j];
      }
    }
    arr[x][y] = num;
    for (var i = x; i >= 0; i--) {
      if (arr[i][y] == num) {
        count++;
      } else if (arr[i][y] == 0) {
        live += 1; //空位标记  
        i = -1;
      } else {
        death += 1; //颜色不同是标记一边被堵住  
        i = -1;
      }
    }
    for (var i = x; i <= 14; i++) {
      if (arr[i][y] == num) {
        count++;
      } else if (arr[i][y] == 0) {
        live += 1; //空位标记  
        i = 100;
      } else {
        death += 1;
        i = 100;
      }
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的左右得分为" + model(count, death));  
    return this.model(count, death);
  },

  topBottom: function(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑  
    var live = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
      arr[i] = new Array(15);
      for (var j = 0; j < 15; j++) {
        arr[i][j] = this.chessBoard.chessData[i][j];
      }
    }
    arr[x][y] = num;
    for (var i = y; i >= 0; i--) {
      if (arr[x][i] == num) {
        count++;
      } else if (arr[x][i] == 0) {
        live += 1; //空位标记  
        i = -1;
      } else {
        death += 1;
        i = -1;
      }
    }
    for (var i = y; i <= 14; i++) {
      if (arr[x][i] == num) {
        count++;
      } else if (arr[x][i] == 0) {
        live += 1; //空位标记  
        i = 100;
      } else {
        death += 1;
        i = 100;
      }
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的上下斜得分为" + model(count, death));  
    return this.model(count, death);
  },

  rightBottom: function(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑  
    var live = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
      arr[i] = new Array(15);
      for (var j = 0; j < 15; j++) {
        arr[i][j] = this.chessBoard.chessData[i][j];
      }
    }
    arr[x][y] = num;
    for (var i = x, j = y; i >= 0 && j >= 0;) {
      if (arr[i][j] == num) {
        count++;
      } else if (arr[i][j] == 0) {
        live += 1; //空位标记  
        i = -1;
      } else {
        death += 1;
        i = -1;
      }
      i--;
      j--;
    }
    for (var i = x, j = y; i <= 14 && j <= 14;) {
      if (arr[i][j] == num) {
        count++;
      } else if (arr[i][j] == 0) {
        live += 1; //空位标记  
        i = 100;
      } else {
        death += 1;
        i = 100;
      }
      i++;
      j++;
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的右下斜得分为" + model(count, death));  
    return this.model(count, death);
  },

  rightTop: function(x, y, num) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑  
    var live = 0;
    var count = 0;
    var arr = new Array(15);
    for (var i = 0; i < 15; i++) {
      arr[i] = new Array(15);
      for (var j = 0; j < 15; j++) {
        arr[i][j] = this.chessBoard.chessData[i][j];
      }
    }
    arr[x][y] = num;
    for (var i = x, j = y; i >= 0 && j <= 14;) {
      if (arr[i][j] == num) {
        count++;
      } else if (arr[i][j] == 0) {
        live += 1; //空位标记  
        i = -1;
      } else {
        death += 1;
        i = -1;
      }
      i--;
      j++;
    }
    for (var i = x, j = y; i <= 14 && j >= 0;) {
      if (arr[i][j] == num) {
        count++;
      } else if (arr[i][j] == 0) {
        live += 1; //空位标记  
        i = 100;
      } else {
        death += 1;
        i = 100;
      }
      i++;
      j--;
    }
    count -= 1;
    // console.log(x + "," + y + "位置上的右上斜得分为" + model(count, death));  
    return this.model(count, death);
  },

  /**罗列相等效果的棋型(此处只考虑常见的情况，双成五，双活四等少概率事件不考虑) 
   * 必胜棋：成五=活四==双活三=冲四+活三=双冲四 
   *  
   *  
   *  
   */
  model: function(count, death) {
    // console.log("count" + count + "death" + death);  
    var LEVEL_ONE = 0; //单子  
    var LEVEL_TWO = 1; //眠2，眠1  
    var LEVEL_THREE = 1500; //眠3，活2  
    var LEVEL_FOER = 4000; //冲4，活3  
    var LEVEL_FIVE = 10000; //活4  
    var LEVEL_SIX = 100000; //成5  
    if (count == 1 && death == 1) {
      return LEVEL_TWO; //眠1  
    } else if (count == 2) {
      if (death == 0) {
        return LEVEL_THREE; //活2  
      } else if (death == 1) {
        return LEVEL_TWO; //眠2  
      } else {
        return LEVEL_ONE; //死棋  
      }
    } else if (count == 3) {
      if (death == 0) {
        return LEVEL_FOER; //活3  
      } else if (death == 1) {
        return LEVEL_THREE; //眠3  
      } else {
        return LEVEL_ONE; //死棋  
      }
    } else if (count == 4) {
      if (death == 0) {
        return LEVEL_FIVE; //活4  
      } else if (death == 1) {
        return LEVEL_FOER; //冲4  
      } else {
        return LEVEL_ONE; //死棋  
      }
    } else if (count == 5) {
      return LEVEL_SIX; //成5  
    }
    return LEVEL_ONE;
  }
}
