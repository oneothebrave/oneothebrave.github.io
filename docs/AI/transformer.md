# Transformer

下面内容主要来自于[The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)，非常棒的文章。再加上一些补充以及一些理解





# Overview

我们从一个非常简单又常用的情景开始：翻译。输入一个句子，经过model处理，输出它的法语翻译

![image.png](/images/transformer-1.png)

LLM(Large Language Model)在其中做了什么事呢？把脑子一刀劈开，就能发现它是由两大主要部分组成：**Encoders** 和 **Decoders**

![image.png](/images/transformer-2.png)

**Encoders**是由一组encoder组成(图中有5个encoder，但实际不一定是5个，也可以是其他数字)。**Decoders**则是由一组decoder组成

![image.png](/images/transformer-3.png)

每个encoder在**结构**上都是一摸一样的。注意，仅仅在**结构**上一样，在**权重**上是不一样的(关于权重，这个后面会讲到)。每个encoder由两部分组成: S**elf-Attention**和F**eed Forward Neural Network**

![image.png](/images/transformer-4.png)

输入进入encoder层后，首先会流入self-attention层。该层帮助encoder在encode特定单词时关注输入句子中的其他单词。我们将在本文后面更详细地探讨self-attention机制。

self-attention层的输出会被喂给FFNN(Feed Forward Neural Network)层。【【还要补充这层的作用】】

decoder层同样也有self-attention和FFNN, 但与encoder不同的是，它多了一层Encoder-Decoder Attention层，也叫Cross-attention层 【【还要补充这层的作用】】

![image.png](/images/transformer-5.png)

以上就是Encoder和Decoder的概述。接下去我们深入到核心部分 **Encoder**



# Let us ~~encoding~~ embedding

从概述部分的例子，我们了解到了输入（*I am Batman*）会先流入encoder层，然后经过一系列处理最终输出(*Je suis Batman*)。这里就产生了一个疑问：encoder怎么会认识 “I am Batman”这句话？如果我改成 “我是蝙蝠侠” / “Ik ben Batman” / …  等不同的语言，显然同样可以成功。为什么呢？encoder，或者说Transformer怎么能懂这么多国的语言呢 ？

答案就是：不，它不懂，它只知道数学运算。

在输入传入encoder之前，会先进行一个很重要的必需的操作：**Embedding**

简单地说，embedding会把单词转化成行向量表示(为什么不是列向量？因为列向量代表隐藏向量的维度，后面会解释)。行向量就是一个 1✖️n  的矩阵，我们描述一个矩阵的形状，通常说这个矩阵是几行几列的，比如3✖️4 就是一个三行四列的矩阵。与Transformer打交道的就是矩阵。

这里展示了一个1✖️4和一个3✖️4的矩阵，下标代表该参数所在的行列数

![image.png](/images/transformer-10.png)

这里我们传给encoder的是一句话”I am Batman”，这句话是怎么被embedding成矩阵的呢？矩阵中的数字又是什么呢？

在Embedding之前，还需要一个操作，叫做**Tokenization。** 顾名思义，就是把prompt(也就是输入的句子)分成一个个单词。

![image.png](/images/transformer-6.png)

这里”I am Batman”被分成了三个单词，很简单对不对。尽管经过tokenizer,句子已经成为一个个单词了，但它们还是人类的单词，transformer只与矩阵打交道。那么接下来就要把一个个单词转化为向量，再把这些向量组合起来，矩阵就出现了。想象有一张很大的vocabulary表，记录了50000个单词，并给每个单词约定了一个id，类似于：

![image.png](/images/transformer-7.png)

> 这只是一张示意图，完全是假数据
> 

那么几乎每一个单词都有了它对应的ID。为什么说几乎呢，因为有些单词是不同的时态表示或者结尾带了 **‘s,** 更何况人们隔三差五就会创造出一个新词，所以显然不会也不能把所有的单词都录入进这张vocabulary表中，但是在tokenization的时候可以把这种”特殊单词“拆分，找到它们各自的id，再组合起来。比如”I am Batman’s enemy”, 其中”Batman’s” 就会被分成”Batman” 和 “’s”， 然后在表中找到各自映射的id，从而就有了”Batman’s”这类单词的表示。

也许你已经注意到了，用“单词”这个说法并不准确。实际上，它们被称作“token”，token可以是英语单词，也可以是”##le”，甚至可以是“🍎”。 这很好地与tokenization联系了起来。也可以联想到AI公司提供LLM的api都明确标注了价格，比如$4/million token

在完成 tokenization 之后，每个 token 会被映射为一个离散的 token id，这个id不携带意义，没有大小关系，没有语义，只是一个索引。接下来进入到embedding。

Transformer 并不会直接对离散 id 进行计算，而是通过一个 embedding layer，将 token id 映射为一个连续向量。说白了，embedding 层仅根据 token id 从已训练好的 embedding 矩阵中查找对应向量，即又是一个查表的操作。参数保持冻结，不参与损失计算或梯度更新(这是训练阶段做的事)。

![image.png](/images/transformer-8.png)

一个token对应一个向量，多个token就组成了一个矩阵。等等，先在这停顿，这个表是怎么来的？我们前面描述的 Embedding阶段的查表操作是在Inference(推理)阶段才会这么做，这么做的前提是Training / Pre-training / Fine-tuning（训练）阶段训练好了这张表。训练阶段做了什么呢？

在训练阶段，embedding 矩阵作为 Transformer 模型的可训练参数之一，通过反向传播和梯度下降最小化语言建模损失，即优化损失函数；训练完成后，该矩阵参数被冻结，在推理阶段仅用于根据 token id 查询对应的向量表示。关于梯度下降和损失函数，看这里【【这里要加入链接】】

> [!NOTE]
>
> 最开始的，未被训练的embedding矩阵是通过随机初始化得到的，**不包含任何语义信息**，只是满足数值稳定性的随机值。来自于均匀分布，正态分布等。

现在我们有了一个矩阵，终于可以进入encoder了….吗？ 还不行。

组成句子的 token 集合可能完全相同，但不同的顺序会导致语义发生变化，例如 “Ross loves Rachel” 与 “Rachel loves Ross” 就让老友记拍了10季。

在 Transformer 中，encoder层中的 self-attention 的计算本身对输入顺序是置换不敏感的，如果仅使用 token embedding，模型无法区分这类顺序不同但 token 相同的句子。因此，必须在构造 encoder 输入表示时显式引入位置信息。常见做法是将使用sin / cos 生成的 positional embedding 与 token embedding 在同一维度空间中逐元素相加，从而使后续的 attention 计算能够同时利用语义信息和位置信息。

![image.png](/images/transformer-9.png)

> [!TIP]
>
> 你可能会有疑问：E与PE相加后，会不会出现等于另一个E / E+PE 这种情况？
>
> 不会。在高维球面上，随机移动一个微小的距离正好落在另一个有效单词语义中心点上的概率，在数学上几乎为零



# Let us encoding

这是一张encoder层的概览。在完成之前的步骤后，一组向量（即一个矩阵）作为输入传入**self-attention**层，接着流入feed-forwar neural network层，然后作为该层encoder的输出流入下一层encoder

![transformer-11](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-11.png)

好，现在我们知道了“反正就是一个矩阵作为输入流入了第一层encoder，然后做了一些计算，输出的计算结果又作为第二层encoder的输入再进行一些计算” 。那么里面到底做了什么计算呢？在深入了解核心的**self-attention**层做了什么之前，我们先来看这么一句话：

##### ”`The animal didn't cross the street because it was too tired`”

这句话里的 "it" 指的是什么？The animal 还是 the street ？对人类来说这个问题很简单，但模型是怎么知道的呢。

当模型处理每个单词（输入序列中的每个位置）时，自注意力机制使其能够查看输入序列中的其他位置，查找每个词和其他词之间的联系，寻找有助于更好地编码该单词的线索。

![transformer-12](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-12.png)

你可以通过在 [Tensor2Tensor notebook](https://colab.research.google.com/github/tensorflow/tensor2tensor/blob/master/tensor2tensor/notebooks/hello_t2t.ipynb) 中试验来查看每个词与其他词之间的关联程度

接下来我们来详细了解如何用向量进行self-attention的计算



### Self-Attention

计算self-attention的**第一步**是将每个输入的向量与：Query矩阵，Key矩阵，Value矩阵 这三个权重矩阵分别相乘得到query向量，key向量和value向量。因此，如果输入有3个token（图中所示），那么就会有3组query,key,value向量

![transformer-13](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-13.png)

> [!NOTE]
>
> 你可能会疑问Query矩阵，Key矩阵，Value矩阵这三个权重矩阵是什么，它们是怎么来的？
>
> 在训练阶段之前，它们就是由深度学习框架（如Tensorflow,  pyTorch）随机生成的复合特定分布（如正态分布）的参数矩阵。真正赋予它们“灵魂”是在训练过程中。
>
> <u>训练是在已知**标签（Label）的前提下，通过梯度下降算法更新模型参数（Weights）**，从而**最小化**损失函数，使模型的输出分布不断接近真实数据的分布的过程。</u>  其中包括前向传播，计算损失，反向传播，参数更新这几个过程，其中参数更新就是根据梯度更新矩阵中的数值。就这样经过百万次的迭代之后，这三个矩阵逐渐学到了如何提取有意义的特征。
>
> 例如：W_Q 可能会学到在处理动词时，去寻找句子中的主语特征; W_K可能会学到在处理名词时，将其标记为潜在的主语或宾语特征，以便回应W_Q 的寻找;W_V可能会学到在识别到核心实体时，提取其具体的语义信息（如词义、词性或时态），作为最终输出的实质内容。这只是拟人化的解释，实际这三个矩阵的 512 或 1024 个维度往往是**高度抽象且交织**的



query,key,value向量又代表什么呢？可以用一个python字典来类比：

```python
d = {'color': 'blue', 'age': 22, 'type': 'pickup'}
result = d['color']
```

当你在普通字典中查找`query`时，字典会找到匹配的`key`，并返回其对应的`value`。`query`要么有匹配的`key`，要么没有。你可以想象一个模糊字典，其中键不必完全匹配。如果你在上面的字典中查找 `d["species"]`，你可能希望它返回 `pickup`，因为这是与查询最匹配的结果。Attention层执行类似这样的模糊查找，但它并非仅仅寻找最佳`key`。它会根据`query`与每个`key`的匹配程度来组合`values`。

它是如何工作的呢？在attention层中，`query`、`key`和`value`都是向量。attention层并不执行哈希查找，而是将`query`向量和`key`向量组合起来，以确定它们的匹配程度，即“attention score”。该层返回values的平均值，并根据“attention score”进行加权。

查询序列中的每个位置都提供一个查询向量。上下文序列充当字典。上下文序列中的每个位置都提供一个键向量和一个值向量。输入向量不会被直接使用。

这也就是计算self-attention的**第二步**：计算attention score。该分数决定了在对特定位置的单词进行encode时，应该给予输入句子的其他部分多少关注。因此我们需要根据这个词对输入句子中的每个词进行评分。



![transformer-14](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-14.png)

如图所示，attention score的计算方式是将`query`向量与待评分词的`key`向量进行点积运算。比如，要计算第一个单词的self-attention,第一个分数就是q1与k1的点积，代表词"I"对其自身的attention score，目的是确定在理解“I”这个词时，它本身的特征有多重要。第二个分数就是q1与k2的点积，代表词“I”对第二个词“am”的attention score，目的是确定在理解“I”这个词时，第二个词“am”提供了多少上下文信息。同理，第三个分数就是q1与k3的的点积，代表词“I”对第三个词“Batman”的attention score，目的是确定在理解“I”这个词时，第三个词“Batman”提供了多少上下文信息。

**第三步**是将得到的score除以8（默认值）。这么做是为了控制方差，防止梯度消失

**第四步**是将第三步得到的值转为概率分布，实现加权关注，即：Softmax。Softmax 会对分数进行归一化处理，使它们全部为正数且总和为 1。



![transformer-15](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-15.png)

**第五步**是将每个value向量乘以softmax score。这一步是注意力机制的**核心归宿**。如果说之前**q**,**k**是在寻找关联，那么这一步就是在提取并融合信息。Softmax算出的概率本质上是**权重**。将权重乘以Value向量，意味着：

- 高权重(0.65, 0.30)：保留改词的大部分特征信息(value)

- 低权重(0.05)：过滤掉该词大部分无关的信息

也就是说，**q**与**k**的点积只负责算出一个比例：”我该看谁？看多少？“  ， 但并不包含这个词真正的表达内容，只有乘以 v ，模型才能把“注意力比例”转化为“具体的语义表示”。如果没有这一步，模型只知道谁重要，但拿不到重要的数据。

所以softmax乘以value向量，再将结果相加的意义就是：**利用计算出的注意力分布，动态地从所有输入词中提取相关特征，并将它们聚合成一个包含上下文信息的全新向量**。



![transformer-16](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-16.png)

就好比你想自制一杯咖啡，Softmax 告诉你是“65% 的浓缩咖啡”加“30% 的牛奶”加“5%的厚奶泡”。乘以 **v** 的过程就是根据这个配方，真正把咖啡液和牛奶倒进杯子里混合。最后得到的 **z** 就是那杯调好的**卡布奇诺**。



上述步骤的计算结果就会继续流入feed-forward neural network层。在实际实现中，为了加快处理速度，该计算以矩阵形式进行（将同纬度的向量组合起来其实就是矩阵，所以在理解上并没有什么不同）

**首先**将由一个个token经过embedding+positional-embedding组成的**输入矩阵X**去乘以**Query, Key, Value 三个权重矩阵**得到**Query, Key, Value矩阵**

![transformer-17](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-17.png)





**最后**，由公式输出 Z 

> [!NOTE]
>
> **Z的行数严格等于输入序列的长度**。  
>
> 从向量的视角看的话，第一个token生成的z1在Z的第一行，第二个token生成的z2在Z的第二行 ....

![transformer-18](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-18.png)



> [!TIP]
>
> - **Q (Query)**：当前 Token 正在“寻找”什么。
> - **K (Key)**：当前 Token 能向其他 Token “提供”什么。
> - **V (Value)**：当前 Token 携带的“具体信息”。





### Multi-Head Attention

到这里，你应该对single-head attention有了一定的认知。然而如果只有single-head，所有的语义关系都只能在同一个投影子空间里表达，不同类型的关系（语法依赖、指代关系、位置关系、语义相似）会互相干扰。而multi-head attention则允许模型运行8个（或更多）独立的计算过程，比如

- **头 1** 专注于代词指代（“I” 指向谁？）。
- **头 2** 专注于时态（“am” 代表现在时）。
- **头 3** 专注于情感或特定专有名词（“Batman” 的特殊含义）
- ....



**Multi-head 是怎么实现的？**

在实际实现中，通常依然先用输入矩阵X乘以W_Q,W_K,W_V这三个权重矩阵，然后将每个高维矩阵切分成h个局部低维矩阵。例如，总维度 512 被切成 8 个 64 维的向量(维度就是矩阵拥有的列数)。也就是**先乘，再分维度**。

从数学上看，它做的是：

![transformer-19](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-19.png)

每个 head 有自己独立的W^i_Q， W^i_K， W^i_V，然后分别乘以输入，也就是**先分维，再乘**。

可以发现，两者其实是等价的。实际实现中选择先乘再切的路径是出于GPU计算效率，性能优化的考虑。

**切分**完成后，将这三对各8组矩阵分别独立进行刚才的`Score -> Softmax -> Weighting` 过程,也就是8个单头计算，每个头计算结束都会输出一个**该头的Z**，总共输出8个相同形状的Z矩阵(n行64列，n取决于输入序列，还记得吧)。

接着把8个头的输出*Z1,Z2 ... Z8*横向拼接在一起, 最后再乘一个权重矩阵 W_O。最终得到一个流向FFNN的矩阵 --- 大写的Z矩阵

![transformer-20](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-20.png)

> [!WARNING]
>
> 矩阵的横向拼接是指增加列数，如每个单头输出的 **Z** 的拼接
>
> 矩阵的纵向拼接是指增加行数，如每个单头中每个token对应的输出 **z** 的拼接



下面是整个流程的示意图：

![transformer-21](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-21.png)

整个过程就相当于：把一个高维空间拆成多个“语义子空间”，分别建模不同关系。

想象你在评估一个**球员（输入 X）**：

- **头 1（球探视角）**：关注他的体能、速度、爆发力。
- **头 2（战术分析视角）**：关注他的跑位、团队配合、防守意识。
- ......
- **头 8（商业视角）**：关注他的商业价值、粉丝影响力。

最后，你把这些视角的结论汇总，就得到了对这个球员**最全面、立体**的评价



> [!IMPORTANT]
>
> 你可能会同我一样，产生以下几个疑问：
>
> 问：为什么要乘以一个权重矩阵 W_O？
>
> 答：W_O 承担了**“融合”**与**“统一”**的任务，最终与W_O相乘的那个矩阵的每一个维度都融合了来自不同“头”的特征信息，W_O让来自不同头的信息进行**跨头交换**, 决定“如何整合所有视角的发现”（产生最终表示）。
>
> 
>
> 问：切开再拼凑的意义是什么？
>
> 答：如果不平均切开，再拼凑，而是直接将输入X与权重矩阵相乘后再直接与W_O相乘，这就相当于一个single-head与W_O相乘，那么single-head与multi-head的区别就是是否有W_O矩阵，显然这是荒谬的。 因为切-->拼的过程中发生的不单是这个看似多余的操作，实则通过“切分”，我们强制模型在 h 个**独立的低维子空间**内都进行 Softmax 归一化。每个头产生的注意力分布（那些0.65，0.05，0.30）是完全不同的，因为**Softmax 是非线性的**。每个头都在自己的空间里做“信息竞争”。比如头 1 在关注“主谓关系”，头 2 在关注“代词指代”。如果不切，所有的特征（语法、语义、时态）被迫在同一个 Softmax 里竞争。由于 Softmax 的特性，它倾向于让“最强”的那个特征统治全局，从而**抹杀了其他弱势但重要的特征**，就失去了多头注意力的多维度观察能力





### The Residuals

在每个encoder中的每个子层（self-attention、ffnn）周围都有一个残差连接: Resudual Connection (Add&norm中的Add).

Add做的事其数学表达式极为简洁：**Output = x + Sublayer(x)**。

Layer norm的任务是将神经元的输出分布重新调整为均值为 0、方差为 1 的标准分布。简单来说，就是将标准化后的向量进行一次线性变换：乘以一个训练出来的系数，再加上一个训练出来的常数。保证了无论输入数据的量级如何波动，传递到下一层的数值始终处于一个“可控”的范围内，从而极大增强了训练的稳定性。

因此残差层的存在解决深层网络在训练过程中面临的**梯度消失（Gradient Vanishing）**和**模型退化（Degradation）**问题

![transformer-22](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-22.png)



> [!TIP]
>
> 由于残差连接引入了 **x+f(x)** 结构，所以当对这个函数求x的偏导时就会得到 **1+f'(x)** 。这样，即使在反向传播的过程中，f'(x)连续多层都非常小（例如接近于0），有了**“1”**的存在，梯度也不会在传播过程中消失，梯度依然能通过那个 **“1”** 顺畅地流回底层。
>
> 另外，Self-Attention 是一个极具“侵略性”的操作，它会根据上下文大幅度改写词向量的数值，可能导致原始词汇的某些关键特征丢失。通过 **x + Attention(x)**，模型在获取上下文信息的同时，强制保留了原始输入的特征。这对于保持语义的一致性至关重要。



如果把add和norm操作具像化表示，看起来就是这样子：![transformer-23](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-23.png)



一样的模式同样适用于decoder的子层：

![transformer-24](/Users/larryling/Documents/oneothebrave.github.io/docs/images/transformer-24.png)





### Feed forward neural network

FFNN的全称叫**Position-wise** FFNN
