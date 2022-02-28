---
title: "MySQL系列 | 浅尝MySQL索引"
date: 2022-02-09T22:40:49+08:00
draft: false
categories: ["数据库"]
tags: ["MySQL","索引"]
attendpos: top-banner-left
attendbg: http://file.hanyu.cool/site/tech/article/mysql_index/MySQL%E5%B0%81%E9%9D%A2%E5%9B%BE.png
author: 韩西瓜
description: 浅尝索引
custom_cover: http://file.hanyu.cool/site/tech/article/mysql_index/MySQL%E5%B0%81%E9%9D%A2%E5%9B%BE.png
toc: true
featured_image: http://file.hanyu.cool/site/tech/article/mysql_index/MySQL%E5%B0%81%E9%9D%A2%E5%9B%BE-%E4%B8%AA%E7%AB%99-%E9%95%BF%E5%9B%BE.png
tmpbg: /assets/imgs/news/news-4.jpg
foreword: 辛苦移步微信公众号点赞、在看、关注、转发
pageLocaltion: "popular"
---

## 写在前面的废话
Hello，大家好，我是西瓜，一年前我写了一篇文章，然后拖更至今。
这其中有自己懒惰、工作变动等因素，年前这段时间一直在求职面试，拿到了些一线大厂和一些独角兽的offer。这段时间面试的经验和学习的过程对我自己帮助很大，面经还在整理中，后续会发出来给大家做一个参考吧。  
因为每家公司的面试官不同，出题也是千遍万化，所以有些基础的核心知识，必须要体系化的学习，今天写这篇MySQL索引相关的知识也都是面试必问，后面我也会把一些锁、事务等等相关知识点写出来。  
从今天开始，也会持续更新啦。虽然这篇文章很八股很基础，但总要一点点来，不积跬步无以至千里。如果觉得西瓜不错，可以点击关注哦。

个站：[www.hanyu.cool](www.hanyu.cool)  
微信：进入公众号发送 西瓜西瓜 就可以加微信耍啦

咱们一起成长吧！ 

## 什么是索引
索引是一种**有序**的数据结构，它的作用很多人形象的比喻为书的目录。  
>注：数据结构一般是指逻辑上数据的组织形式，就好像运动会时老师要班级里的同学按照某一种队形站位一样。

## 索引的用处
正因为索引是一种一种有序的数据组织形式，所以可以提高查询效率，也让排序行为变得简单。

## 索引的缺点
* 虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行insert、update和delete。因为更新表时，不仅要保存数据，还要保存一下索引文件。
* 建立索引会占用磁盘空间的索引文件。一般情况这个问题不太严重，但如果你在一个大表上创建了多种组合索引，索引文件的会增长很快。
索引只是提高效率的一个因素，如果有大数据量的表，就需要花时间研究建立最优秀的索引，或优化查询语句。

## 索引到底是个什么
其实索引就只是一个硬盘上的文件而已，例如，在InnoDB引擎下，索引其实就是如下MySQL相关目录下的一个后缀名为.ibd的文件。  

![索引文件位置](http://file.hanyu.cool/site/tech/article/mysql_index/%E7%B4%A2%E5%BC%95%E6%96%87%E4%BB%B6%E4%BD%8D%E7%BD%AE.png)
>注：  
如果使用MyISAM存储引擎，数据库文件类型就包括.frm (表结构描述)、.MYD (表数据)、.MYI (索引)  
如果使用InnoDB存储引擎，数据库文件类型就包括.frm (表结构描述)、ibdata1 (共享表空间)、.ibd (索引) 

## 索引在MySQL架构体系位置
MySQL宏观层面可以大致分层如图：
![架构体系](http://file.hanyu.cool/site/tech/article/mysql_index/MySQL.png)
如上图可知，MySQL的索引其实是属于引擎层的数据结构。  
MySQL支持的索引类型是和引擎息息相关的：
![MySQL引擎和索引](http://file.hanyu.cool/site/tech/article/mysql_index/MySQL%E5%BC%95%E6%93%8E%E5%92%8C%E7%B4%A2%E5%BC%95.png)

## 索引类型的比较 
现在MySQL默认的存储引擎使用的是InnoDB，也是大多数公司的选择，而InnoDB的索引数据结构就是B+tree.每一个索引在InnoDB里面对应一棵B+树。 

#### B+tree和B-tree(B-tree读B树不读B减树)
B+tree是B-Tree的一个变种，B+tree只在叶子节点存储数据，而B-tree非叶子节点也存储数据，以下是实验链接：  
[B-tree:https://www.cs.usfca.edu/~galles/visualization/BTree.html](https://www.cs.usfca.edu/~galles/visualization/BTree.html)    
[B+tree:https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)   
因此，B+tree 单个节点的数量更小，在相同的磁盘 IO 下能查询更多的节点。  
另外 B+tree 叶子节点采用双向链表结构，适合MySQL中常见的基于范围的顺序检索场景，而 B-tree 无法做到这一点。  

#### B+tree 索引与 Hash 表
基于哈希表实现，只有精确匹配索引所有列的查询才有效，对于每一行数据，存储引擎都会对所有的索引列计算一个哈希码（hash code），并且Hash索引将所有的哈希码存储在索引中，同时在索引表中保存指向每个数据行的指针。  
但范围查询是MySQL数据库中常见的场景，而Hash表不适合做范围查询，Hash表更适合做等值查询。

### B+tree索引结构图
![主键索引B+tree索引结构图](http://file.hanyu.cool/site/tech/article/mysql_index/%E4%B8%BB%E9%94%AE%E7%B4%A2%E5%BC%95B%2Btree%E7%B4%A2%E5%BC%95%E7%BB%93%E6%9E%84%E5%9B%BE.png)
![二级索引B+tree索引结构图](http://file.hanyu.cool/site/tech/article/mysql_index/%E4%BA%8C%E7%BA%A7%E7%B4%A2%E5%BC%95B%2Btree%E7%B4%A2%E5%BC%95%E7%BB%93%E6%9E%84%E5%9B%BE.png)

## 数据页是什么
在 InnoDB 存储引擎中，所有的数据都被逻辑地存放在表空间中，表空间（tablespace）是存储引擎中最高的存储逻辑单位，在表空间的下面又包括段（segment）、区（extent）、页（page），这部分非本文的重点内容，后续单开一篇来讲。  
**页（Pages）是mysql中磁盘和内存交换的基本单位，也是mysql管理存储空间的基本单位。**  
![数据页](http://file.hanyu.cool/site/tech/article/mysql_index/%E6%95%B0%E6%8D%AE%E9%A1%B5%E7%BB%93%E6%9E%84.png)
Buffer Pool 中存的就是一页一页的数据。再比如，当我们要查询的数据不在 Buffer Pool 中时，InnoDB 会将记录所在的页整个加载到 Buffer Pool 中去；同样的，当我们修改数据时，都需要将数据所在的数据页从磁盘读入到Buffer Pool中，然后在Buffer Pool中对其进行操作，操作完成后将 Buffer Pool 中的脏页刷入磁盘时，也是按照页为单位刷入磁盘的。同一个数据库实例的所有表空间都有相同的页大小，默认情况下，表空间中的页大小都为 16KB，当然也可以通过改变源码中的页大小参数重新编译进行修改，不同的页大小最终也会导致区大小的不同。    

当插入一行数据时，会将该数据页加载到Buffer Pool中，然后从空闲区域中拿出一部分空间分配给数据行区域，当空闲区域耗尽时，表示该数据页已经满了。

这里多提一句，表空间其实就是一个磁盘文件，它们通常以表名.idb的格式存储，数据页都是放在表空间里的，但是因为数据页太多，所以，MySQL又引入了数据区(extent)的概念。  
> 引用：表空间的基本结构，一个表空间对应着一些磁盘文件，每个表空间中有多组数据区，每组数据区中有256个数据区，一个数据区的大小为1mb，每个数据区中存放着64个数据页，每个表空间的第一组数据区的前三个数据页分别为FSP_HDR数据页(存放表空间和该组数据区的基本属性)、IBUF_BITMAP数据页(存放这组数据页中所有的insert_buffer信息)、INODE数据页，其他每组数据区的第一个数据区的前两个数据页都是存放一些特殊信息。

### 为什么页默认16K
假设我们一行数据大小为1K，那么一页就能存储16条数据，也就是一个叶子节点能存16条数据，假设索引列是bigint类型，那么长度为8B(byte)，指针大小在InnoDB的源码中为6B，一共就是14B，那么一页里就可以存 16KB/14B = 1170.  
那么一颗高度为2的B+树能存储的数据为1170*16 = 18720条，一颗高度为3的B+树能存储的数据为1170*1170*16 = 21902400.  
引擎一次最少从磁盘读取16KB内容到内存中，当然一次最少也要把内存中16KB内容刷新到磁盘中，单页读取代价也是蛮高的，一般都会进行预读。  
每次新建节点直接申请一个页的空间,这样就保证一个节点物理上也存储在一个系统页或邻近页里，就实现了一个节点的载入只需要一次I/O.   
MySQL使用页的概念，能很好的利用的文件系统的 **局部性原理**。  
这里需要先普及下磁盘相关知识：
<font size=2px>
> 引用：磁盘存取，磁盘I/O涉及机械操作。磁盘是由大小相同且同轴的圆形盘片组成，磁盘可以转动(各个磁盘须同时转动)。磁盘的一侧有磁头支架，磁头支架固定了一组磁头，每个磁头负责存取一个磁盘的内容。磁头不动，磁盘转动，但磁臂可以前后动，用于读取不同磁道上的数据。磁道就是以盘片为中心划分出来的一系列同心环。磁道又划分为一个个小段，叫扇区，是磁盘的最小存储单元。   
  磁盘读取时，系统将数据逻辑地址传给磁盘，磁盘的控制电路会解析出物理地址（哪个磁道，哪个扇区），于是磁头需要前后移动到相应的磁道——寻道，消耗的时间叫——寻道时间，磁盘旋转将对应的扇区转到磁头下（磁头找到对应磁道的对应扇区），消耗的时间叫——旋转时间，这一系列操作是非常耗时。   
为了尽量减少I/O操作，计算机系统一般采取预读的方式，预读的长度一般为页（区别于MySQL的页）的整倍数。页是计算机管理存储器的逻辑块，硬件及操作系统往往将主存和磁盘存储区分割为连续的大小相等的块，每个存储块称为一页（在许多操作系统中，页的大小通常为4k），主存和磁盘以页为单位交换数据。当程序要读取的数据不在主存中时，会触发一个缺页异常，此时系统会向磁盘发出读盘信号，磁盘会找到数据的起始位置并向后连续读取一页或几页载入内存中，然后异常返回，程序继续运行。    
  计算机系统是分页读取和存储的，一般一页为4KB（8个扇区，每个扇区125B，8*125B=4KB），每次读取和存取的最小单元为一页，而磁盘预读时通常会读取页的整倍数。根据文章上述的【局部性原理】①当一个数据被用到时，其附近的数据也通常会马上被使用。②程序运行期间所需要的数据通常比较集中。由于磁盘顺序读取的效率很高（不需要寻道时间，只需很少的旋转时间），所以即使只需要读取一个字节，磁盘也会读取一页的数据。  
</font>

关于**页**的知识我们先讲这些，后续会单开一篇专门讲。

## 索引的分类
![MySQL索引分类](http://file.hanyu.cool/site/tech/article/mysql_index/MySQL%E7%B4%A2%E5%BC%95%E5%88%86%E7%B1%BB.png)

#### 物理角度
**聚簇索引:**
聚簇索引（clustered index）不是单独的一种索引类型，而是一种数据存储方式，这种存储方式是依靠B+树来实现的。根据表的主键构造一棵B+树且B+树叶子节点存放的都是表的行记录数据时，称该主键索引为聚簇索引。简单说就是，聚簇索引也可理解为将数据存储与索引放到了一块，找到索引也就找到了数据。  
优点：

* 数据访问更快，因为聚簇索引将索引和数据保存在同一个B+树中，因此从聚簇索引中获取数据比非聚簇索引更快
* 聚簇索引对于主键的排序查找和范围查找速度非常快  

缺点：  

* 插入速度严重依赖于插入顺序，按照主键的顺序插入是最快的方式，否则将会出现页分裂，严重影响性能。因此，对于InnoDB表，我们一般都会定义一个自增的ID列为主键（主键列不要选没有意义的自增列，选经常查询的条件列才好，不然无法体现其主键索引性能）
* 更新主键的代价很高，因为将会导致被更新的行移动。因此，对于InnoDB表，我们一般定义主键为不可更新。

 
**非聚簇索引:**
非聚簇索引数据和索引是分开的，B+树叶子节点存放的不是数据表的行记录，而是主键ID。   
缺点：二级索引访问需要两次索引查找，第一次找到主键值，第二次根据主键值找到行数据。  

注：虽然InnoDB和MyISAM存储引擎都默认使用B+树结构存储索引，但是只有InnoDB的主键索引才是聚簇索引，InnoDB中的辅助索引以及MyISAM使用的都是非聚簇索引。每张表最多只能拥有一个聚簇索引。


#### 字段约束角度&应用角度
**主键索引:**
一张表只能有一个主键索引，是一种特殊的唯一索引，一个表只能有一个主键、不允许有空值、不允许重复、不允许为 NULL，一般是在建表的时候同时创建主键索引。

``` sql
建表方式：例如
CREATE TABLE `table_name` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` char(255) NOT NULL ,
    PRIMARY KEY (`id`)
);
```
**普通索引:**
是最基本的索引，没有什么特殊的限制。

``` sql
创建方式：CREATE INDEX index_name ON table(column(length));
修改方式：ALTER TABLE table_name ADD INDEX index_name ON (column(length));
建表方式：CREATE TABLE `table_name ` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` char(255) CHARACTER NOT NULL ,
    PRIMARY KEY (`id`),
    INDEX index_name (title(length))
);
```
**唯一索引:**
与前面的普通索引类似，不同的就是，索引列的值必须唯一，但允许有空值。如果是联合（多列）索引，则列值的组合必须唯一。它有以下几种创建方式：

``` sql
创建方式：CREATE UNIQUE INDEX indexName ON table(column(length))
修改方式：ALTER TABLE table_name ADD UNIQUE indexName ON (column(length))
建表方式：CREATE TABLE `table_name ` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` char(255) CHARACTER NOT NULL ,
    UNIQUE indexName (title(length))
);
```
**联合索引:**
两个或两个以上字段联合组成一个索引。使用时需要注意满足最左匹配原则！

``` sql
ALTER TABLE `table_name` ADD INDEX idx_name_city_age (name,city,age); 
```
**tips：**
``` sql 
删除索引的方法:
DROP INDEX index_name ON table_name
```
## 回表
假设你的某个索引由 a,b 两个字段组成为名为 idx_a_b的索引，然后你的查询语句是
``` sql
SELECT a,b,c FROM t where a = 2
```
此时因为你的 idx_a_b 的索引树叶子结点并不包含字段c的数据，所以MySQL会根据idx_a_b这棵树的叶子结点中存储的主键ID，去主键索引树上去查询数据，这个过程就叫做回表。  
**简单一句话就是，二级索引叶子结点不完全包含要查询的数据，所以需要根据二级索引叶子结点中的主键ID去主键索引树查数据。**  

## 索引覆盖
如果你使用某个二级索引查询数据，这个索引的叶子结点包含了你要查询的全部字段，不需要进行**回表**（回主键树查），那么就叫做**索引覆盖**。

## 最左前缀
在MySQL建立联合索引时会遵守最左前缀匹配原则，即最左优先，在检索数据时从联合索引的最左边开始匹配。 联合索引中除最左侧字段外，其他都是相对顺序。假设由 a,b (均int类型)组成的联合索引树如图，在上面的数字是a，下面上数字为b，当a的值相等时，b的值才有序（相对有序）。
![联合索引树](http://file.hanyu.cool/site/tech/article/mysql_index/%E8%81%94%E5%90%88%E7%B4%A2%E5%BC%95B%2Btree%E7%B4%A2%E5%BC%95%E7%BB%93%E6%9E%84%E5%9B%BE.png)
**在文章的最下面会详细解释最左前缀原则的实际案例。**

## 索引下推
假设有这样一张表：
![用户表](http://file.hanyu.cool/site/tech/article/mysql_index/%E7%B4%A2%E5%BC%95%E4%B8%8B%E6%8E%A8.png)
有如下查询：
``` sql
SELECT * FROM user WHERE name LIKE '韩%' AND age = 30;
```
根据前面说的“最左前缀原则”，该语句在搜索索引树的时候，只能匹配到名字第一个字是“韩”的记录，接下来是怎么处理的呢？当然就是从这条记录开始，逐个回表，到主键索引上找出相应的记录，再比对age字段的值是否符合条件。  
但是！MySQL 5.6引入了索引下推优化，可以在二级索引（假设由name和age组成的联合索引idx_name_age）遍历过程中，对索引中包含的字段先做判断（查出第一个“韩”，然后直接对比age字段），先过滤掉不符合条件的记录，减少回表次数。

## 索引重建
索引可能因为删除，或者页分裂等原因，导致数据页有空洞，重建索引的过程会创建一个新的索引，把数据按顺序插入，这样页面的利用率最高，也就是索引更紧凑、更省空间。
可使用以下方式重建索引：
``` sql
alter table `table_name` drop index `index_name`;
alter table `table_name` add index(`index_name`);
```

## 索引创建原则
* 表的主键、外键必须有索引；
* 经常与其他表进行连接的表，在连接字段上应该建立索引；
* 经常出现在where子句中的字段，特别是大表的字段，应该建立索引
* 索引应该建在选择性高的字段上；
* 在经常需要根据范围进行搜索的列上创建索引，因为索引已经排序，其指定的范围是连续的；
* 在经常需要排序的列上创建索引，因为索引已经排序，这样查询可以利用索引的排序，加快排序查询时间；
* 为经常出现在关键字order by、group by、distinct后面的字段，建立索引；
* 索引应该建在小字段上，对于大的文本字段甚至超长字段，不要建索引；
* 频繁进行数据操作的表，不要建立太多的索引，因为索引需要维护；
* 删除无用的索引，避免对执行计划造成负面影响；
* 对于那些在查询中很少使用或者参考的列不应该创建索引。既然这些列很少使用到，因此有索引或者无索引，并不能提高查询速度。相反，由于增加了索引，反而降低了系统的维护速度和增大了空间需求；
* 不要在有大量相同取值的字段上，建立索引。这是因为，由于这些列的取值很少，例如性别列，在查询的结果中，结果集的数据行占了表中数据行的很大比例，即需要在表中搜索的数据行的比例很大。增加索引，并不能明显加快检索速度；
* 当修改性能需求远远大于检索性能时，不应该创建索引。这是因为，修改性能和检索性能是互相矛盾的。当增加索引时，会提高检索性能，但是会降低修改性能。当减少索引时，会提高修改性能，降低检索性能。因此，当修改性能需求远远大于检索性能时，不应该创建索引。
* 对字符串列进行索引，应该指定一个前缀长度（前缀索引）。例如，如果有一个char(255)的列，如果在前10个或20个字符内，多数值是唯一的（区分度大），那么就不要对整个列进行索引。前缀索引不仅可以提高查询速度而且可以节省磁盘空间和I/O操作。

## 哪些情况下索引会失效
* 不要在where条件语句 '=' 的左边进行函数、运算符或表达式的计算，如 

``` sql
SELECT name FROM tb_user WHERE age/2 = 20 以及 SELECT * FROM table_name WHERE YEAR(column_name) < 2022 ，索引不会生效（引擎会放弃使用索引，进行全表扫描）；
```

* 不推荐使用like操作，如果非使用不可，like '%aaa%' 和 like '%aaa' 都不会使用索引而 like 'aaa%' 可以使用索引；
* 避免对字段进行null的判断，因为索引不会生效（可以用一个值代替null，如-999）
* 避免使用or，可以用union替代（要想使用or，又让索引生效，or条件中的每个列都必须加上索引）
* 使用exist代替in（表中数据越多，exist的效率就比in要越大）
* 数据类型隐形转换，索引不会生效：如 

``` sql 
SELECT name FROM user WHERE phone=13011112222;（phone字段在数据库中为varchar类型，应改成 phone='13011112222'）
```

* 联合索引要符合最左前缀原则，例如，由三个字段 a,b,c 组成联合索引 idx_a_b_c

``` sql
索引生效：SELECT * FROM table_name WHERE a = 1 AND b = 2 AND c = 5 
索引生效：SELECT * FROM table_name WHERE b = 2 AND a = 1 AND c = 5 
索引生效：SELECT * FROM table_name WHERE a = 1  

索引失效：SELECT * FROM table_name WHERE b = 2 AND c = 5
索引失效：SELECT * FROM table_name WHERE c = 5 

部分生效：SELECT * FROM table_name WHERE a = 1 AND c = 5 
部分生效：SELECT * FROM table_name WHERE a = 1 AND b > 2 AND c = 5 
```

**索引两个字听起来简单，但关于索引、关于MySQL还有很多很多重要的知识点，一篇文章我们讲不完，西瓜会一点一滴写出MySQL系列文章，和大家一起进步。**

> 辛苦移步微信公众号点赞、在看、关注、转发：
[MySQL系列 | 浅尝MySQL索引](https://mp.weixin.qq.com/s/5UbmpnxmIV9ZDnAF9KaYdg)  