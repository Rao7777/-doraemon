# *sql && sequelize 学习笔记 - Query 查询语句*


[Sequelize query](http://docs.sequelizejs.com/manual/tutorial/querying.html)， 
[sql](http://www.runoob.com/sql/sql-syntax.html)


# Attributes 
 ```
 //SELECT foo, bar ...
 Model.findAll({
  attributes: ['foo', 'bar']
});

// SELECT foo, bar AS baz ...  
Model.findAll({
  attributes: ['foo', ['bar', 'baz']]
});

// SELECT COUNT(hats) AS no_hats ...
Model.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});


```

### [SQL COUNT()函数](http://www.runoob.com/sql/sql-func-count.html)
* #### SQL COUNT(column_name)
函数返回指定列的值的数目（NULL 不计入）  
`SELECT COUNT(column_name) FROM table_name;`
* #### SQL COUNT(*) 语法 
函数返回表中的记录数  
` SELECT COUNT(*) FROM table_name;`  
* #### SQL COUNT(DISTINCT column_name) 
函数返回指定列的不同值的数目  
` SELECT COUNT(DISTINCT column_name) FROM table_name;`


# [Where](http://docs.sequelizejs.com/manual/tutorial/querying.html#where)
## Basics
```
const Op = Sequelize.Op;

// SELECT * FROM post WHERE authorId = 2
Post.findAll({
  where: {
    authorId: 2
  }
});


// SELECT * FROM post WHERE authorId = 12 AND status = 'active';
Post.findAll({
  where: {
    authorId: 12,
    status: 'active'
  }
});


// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
Post.findAll({
  where: {
    [Op.or]: [{authorId: 12}, {authorId: 13}]
  }
});


// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
Post.findAll({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});


// DELETE FROM post WHERE status = 'inactive';
Post.destroy({
  where: {
    status: 'inactive'
  }
});


// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;
Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      [Op.ne]: null
    }
  }
});


// SELECT * FROM post WHERE char_length(status) = 6;
Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
```

## Operators
```
/*  
* # {操作符}  描述
* sequelize  //mySQL
*/

# { = }  等号，检测两个值是否相等，如果相等返回true 
[Op.and]: {a: 5}   // AND (a = 5)                 

# { > } 小于号，检测左边的值是否小于右边的值, 如果左边的值小于右边的值返回true
[Op.gt]: 6            // id > 6

# { >= } 大于等于号，检测左边的值是否大于或等于右边的值, 如果左边的值大于或等于右边的值返回true
 [Op.gte]: 6,               // id >= 6

# { < } 小于号，检测左边的值是否小于右边的值, 如果左边的值小于右边的值返回true
[Op.lt]: 10,               // id < 10

# { <= }  小于等于号，检测左边的值是否小于于或等于右边的值, 如果左边的值小于或等于右边的值返回true
[Op.lte]: 10,              // id <= 10

# { <>, != } 不等于，检测两个值是否相等，如果不相等返回true
[Op.ne]: 20,               // id != 20

# { BETWEEN } 在某个范围内
[Op.between]: [6, 10],     // BETWEEN 6 AND 10

# { LIKE } 搜索某种模式
[Op.like]: '%hat',         // LIKE '%hat'

# { IN } 指定针对某个列的多个可能值
[Op.in]: [1, 2],           // IN [1, 2]

# (a = 5 OR a = 6)
[Op.or]: [{a: 5}, {a: 6}]

# NOT BETWEEN 11 AND 15
[Op.notBetween]: [11, 15]

# NOT IN [1, 2]
[Op.notIn]: [1, 2]

# NOT LIKE '%hat'
[Op.notLike]: '%hat'

# ILIKE '%hat' (case insensitive)  (PG only)
[Op.iLike]: '%hat'

# NOT ILIKE '%hat'  (PG only)
[Op.notILike]: '%hat'

# && [1, 2] (PG array overlap operator)
[Op.overlap]: [1, 2]

#  @> [1, 2] (PG array contains operator)
[Op.contains]: [1, 2]

# <@ [1, 2] (PG array contained by operator)
[Op.contained]: [1, 2]

# ANY ARRAY[2, 3]::INTEGER (PG only)
[Op.any]: [2,3] 
```

## Range Operators
```
# @> '2'::integer (PG range contains element operator)
[Op.contains]: 2

# @> [1, 2) (PG range contains range operator)
[Op.contains]: [1, 2]  

# <@ [1, 2) (PG range is contained by operator)
[Op.contained]: [1, 2] 

# && [1, 2) (PG range overlap (have points in common) operator)
[Op.overlap]: [1, 2]   

# -|- [1, 2) (PG range is adjacent to operator)
[Op.adjacent]: [1, 2]      

# << [1, 2) (PG range strictly left of operator)
[Op.strictLeft]: [1, 2]  

# >> [1, 2) (PG range strictly right of operator)
[Op.strictRight]: [1, 2]  

# &< [1, 2) (PG range does not extend to the right of operator)
[Op.noExtendRight]: [1, 2] 

# &> [1, 2) (PG range does not extend to the left of operator)
[Op.noExtendLeft]: [1, 2]  
```


# Pagination / Limiting 分页查询
```
// Fetch 10 instances/rows
Project.findAll({ limit: 10 })

// Skip 8 instances/rows
Project.findAll({ offset: 8 })

// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 })
```

# [Ordering 排序](http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering)
关键字默认按照升序排序。如果需要按照降序排序，可以使用 `DESC` 关键字
```
Subtask.findAll({
  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['title', 'DESC'],

    // Will order by max(age)
    sequelize.fn('max', sequelize.col('age')),

    // Will order by max(age) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // Will order by  otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // Will order an associated model's created_at using the model name as the association's name.
    [Task, 'createdAt', 'DESC'],

    // Will order through an associated model's created_at using the model names as the associations' names.
    [Task, Project, 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using the name of the association.
    ['Task', 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using the names of the associations.
    ['Task', 'Project', 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using an association object. (preferred method)
    [Subtask.associations.Task, 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using association objects. (preferred method)
    [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using a simple association object.
    [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at simple association objects.
    [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
  ]

  // Will order by max age descending
  order: sequelize.literal('max(age) DESC')

  // Will order by max age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.fn('max', sequelize.col('age'))

  // Will order by age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.col('age')
})
```
 





