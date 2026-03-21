# Transformer底层逻辑：从token到生成

内容参考自[The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)，非常棒的文章。

再加上一些深入的补充以及一些理解





# Overview

我们从一个非常简单又常用的情景开始：翻译。输入一个句子，经过model处理，输出它的法语翻译

![image.png](/images/transformer-1.png)

LLM(Large Language Model)在其中做了什么事呢？把脑子一刀劈开，就能发现它是由两大主要部分组成：**Encoders** 和 **Decoders**

![image.png](/images/transformer-2.png)

**Encoders**是由一组encoder组成(图中有5个encoder，但实际不一定是5个，也可以是其他数字)。**Decoders**则是由一组decoder组成

![image.png](/images/transformer-3.png)

每个encoder在**结构**上都是一摸一样的。注意，仅仅在**结构**上一样，在**权重**上是不一样的(关于权重，这个后面会讲到)。每个encoder由两部分组成: S**elf-Attention**和**Feed Forward Neural Network**

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

在训练阶段，embedding 矩阵作为 Transformer 模型的可训练参数之一，通过反向传播和梯度下降最小化语言建模损失，即优化损失函数；训练完成后，该矩阵参数被冻结，在推理阶段仅用于根据 token id 查询对应的向量表示。

> [!NOTE]
>
> 最开始的，未被训练的embedding矩阵是通过随机初始化得到的，**不包含任何语义信息**，只是满足数值稳定性的随机值。来自于均匀分布，正态分布等。

现在我们有了一个矩阵，终于可以进入encoder了….吗？ 还不行。

组成句子的 token 集合可能完全相同，但不同的顺序会导致语义发生变化，比如["dog", "bites", "man"] 和 ["man", "bites", "dog"]会产生完全相同的attention分布。在 Transformer 中，encoder层中的 self-attention 的计算本身对输入顺序是置换不敏感的，如果仅使用 token embedding，模型无法区分这类顺序不同但 token 相同的句子。因此，必须在构造 encoder 输入表示时显式引入位置信息。传统做法是将使用sin / cos 生成的 positional embedding 与 token embedding 在同一维度空间中逐元素相加，从而使后续的 attention 计算能够同时利用语义信息和位置信息。现代模型已经改用旋转位置编码(RoPE)。

![image.png](/images/transformer-9.png)

> [!TIP]
>
> 你可能会有疑问：E与PE相加后，会不会出现等于另一个E / E+PE 这种情况？
>
> 不会。在高维球面上，随机移动一个微小的距离正好落在另一个有效单词语义中心点上的概率，在数学上几乎为零



# Let us encoding

这是一张encoder层的概览。在完成之前的步骤后，一组向量（即一个矩阵）作为输入传入**self-attention**层，接着流入feed-forwar neural network层，然后作为该层encoder的输出流入下一层encoder

![image.png](/images/transformer-11.png)

好，现在我们知道了“反正就是一个矩阵作为输入流入了第一层encoder，然后做了一些计算，输出的计算结果又作为第二层encoder的输入再进行一些计算” 。那么里面到底做了什么计算呢？在深入了解核心的**self-attention**层做了什么之前，我们先来看这么一句话：

##### ”`The animal didn't cross the street because it was too tired`”

这句话里的 "it" 指的是什么？The animal 还是 the street ？对人类来说这个问题很简单，但模型是怎么知道的呢。

当模型处理每个单词（输入序列中的每个位置）时，自注意力机制使其能够查看输入序列中的其他位置，查找每个词和其他词之间的联系，寻找有助于更好地编码该单词的线索。

![image.png](/images/transformer-12.png)

你可以通过在 [Tensor2Tensor notebook](https://colab.research.google.com/github/tensorflow/tensor2tensor/blob/master/tensor2tensor/notebooks/hello_t2t.ipynb) 中试验来查看每个词与其他词之间的关联程度

接下来我们来详细了解如何用向量进行self-attention的计算



### Self-Attention

计算self-attention的**第一步**是将每个输入的向量与：Query矩阵，Key矩阵，Value矩阵 这三个权重矩阵分别相乘得到query向量，key向量和value向量。因此，如果输入有3个token（图中所示），那么就会有3组query,key,value向量

![image.png](/images/transformer-13.png)

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



![image.png](/images/transformer-14.png)

如图所示，attention score的计算方式是将`query`向量与待评分词的`key`向量进行点积运算。比如，要计算第一个单词的self-attention,第一个分数就是q1与k1的点积，代表词"I"对其自身的attention score，目的是确定在理解“I”这个词时，它本身的特征有多重要。第二个分数就是q1与k2的点积，代表词“I”对第二个词“am”的attention score，目的是确定在理解“I”这个词时，第二个词“am”提供了多少上下文信息。同理，第三个分数就是q1与k3的的点积，代表词“I”对第三个词“Batman”的attention score，目的是确定在理解“I”这个词时，第三个词“Batman”提供了多少上下文信息。

**第三步**是将得到的score除以8（默认值）。这么做是防止点积值因随维度增大而变大，进而Softmax 饱和，从而导致梯度消失

**第四步**是将第三步得到的值转为概率分布，实现加权关注，即：Softmax。Softmax 会对分数进行归一化处理，使它们全部为正数且总和为 1。



![image.png](/images/transformer-15.png)

**第五步**是将每个value向量乘以softmax score。这一步是注意力机制的**核心归宿**。如果说之前**q**,**k**是在寻找关联，那么这一步就是在提取并融合信息。Softmax算出的概率本质上是**权重**。将权重乘以Value向量，意味着：

- 高权重(0.65, 0.30)：保留改词的大部分特征信息(value)

- 低权重(0.05)：过滤掉该词大部分无关的信息

也就是说，**q**与**k**的点积只负责算出一个比例：”我该看谁？看多少？“  ， 但并不包含这个词真正的表达内容，只有乘以 v ，模型才能把“注意力比例”转化为“具体的语义表示”。如果没有这一步，模型只知道谁重要，但拿不到重要的数据。

所以softmax乘以value向量，再将结果相加的意义就是：**利用计算出的注意力分布，动态地从所有输入词中提取相关特征，并将它们聚合成一个包含上下文信息的全新向量**。



![image.png](/images/transformer-16.png)

就好比你想自制一杯咖啡，Softmax 告诉你是“65% 的浓缩咖啡”加“30% 的牛奶”加“5%的厚奶泡”。乘以 **v** 的过程就是根据这个配方，真正把咖啡液和牛奶倒进杯子里混合。最后得到的 **z** 就是那杯调好的**卡布奇诺**。



上述步骤的计算结果就会继续流入feed-forward neural network层。在实际实现中，为了加快处理速度，该计算以矩阵形式进行（将同纬度的向量组合起来其实就是矩阵，所以在理解上并没有什么不同）

**首先**将由一个个token经过embedding+positional-embedding组成的**输入矩阵X**去乘以**Query, Key, Value 三个权重矩阵**得到**Query, Key, Value矩阵**

![image.png](/images/transformer-17.png)





**最后**，由公式输出 Z 

![image.png](/images/transformer-18.png)

> [!NOTE]
>
> **Z的行数严格等于输入序列的长度**。  
>
> 从向量的视角看的话，第一个token生成的z1在Z的第一行，第二个token生成的z2在Z的第二行 ....



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

在实际实现中，通常依然先用输入矩阵X乘以W<sup>Q</sup>,W<sup>K</sup>,W<sup>V</sup>这三个权重矩阵，然后将每个高维矩阵切分成h个局部低维矩阵。例如，总维度 512 被切成 8 个 64 维的向量(维度就是矩阵拥有的列数)。也就是**先乘，再分维度**。

从数学上看，它做的是：

![image.png](/images/transformer-19.png)

每个 head 有自己独立的$W_Q$<sup>i</sup>， $W_K$<sup>i</sup>， $W_V $<sup>i</sup>，然后分别乘以输入，也就是**先分维，再乘**。

可以发现，两者其实是等价的。实际实现中选择先乘再切的路径是出于GPU计算效率，性能优化的考虑。

**切分**完成后，将这三对各8组矩阵分别独立进行刚才的`Score -> Softmax -> Weighting` 过程,也就是8个单头计算，每个头计算结束都会输出一个**该头的Z**，总共输出8个相同形状的Z矩阵(n行64列，n取决于输入序列，还记得吧)。

接着把8个头的输出*Z1,Z2 ... Z8*横向拼接在一起, 最后再乘一个权重矩阵 W<sup>O</sup>。最终得到一个流向FFNN的矩阵 --- 大写的Z矩阵

![image.png](/images/transformer-20.png)

> [!WARNING]
>
> 矩阵的横向拼接是指增加列数，如每个单头输出的 **Z** 的拼接
>
> 矩阵的纵向拼接是指增加行数，如每个单头中每个token对应的输出 **z** 的拼接



下面是整个流程的示意图：


![image.png](/images/transformer-21.png)

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
> 问：为什么要乘以一个权重矩阵 W<sup>O</sup>？
>
> 答：W<sup>O</sup> 承担了**“融合”**与**“统一”**的任务，最终与W_O相乘的那个矩阵的每一个维度都融合了来自不同“头”的特征信息，W<sup>O</sup>让来自不同头的信息进行**跨头交换**, 决定“如何整合所有视角的发现”（产生最终表示）。
>
> 
>
> 问：切开再拼凑的意义是什么？
>
> 答：如果不平均切开，再拼凑，而是直接将输入X与权重矩阵相乘后再直接与W<sup>O</sup>相乘，这就相当于一个single-head与W<sup>O</sup>相乘，那么single-head与multi-head的区别就是是否有W<sup>O</sup>矩阵，显然这是荒谬的。 因为切-->拼的过程中发生的不单是这个看似多余的操作，实则通过“切分”，我们强制模型在 h 个**独立的低维子空间**内都进行 Softmax 归一化。每个头产生的注意力分布（那些0.65，0.05，0.30）是完全不同的，因为**Softmax 是非线性的**。每个头都在自己的空间里做“信息竞争”。比如头 1 在关注“主谓关系”，头 2 在关注“代词指代”。如果不切，所有的特征（语法、语义、时态）被迫在同一个 Softmax 里竞争。由于 Softmax 的特性，它倾向于让“最强”的那个特征统治全局，从而**抹杀了其他弱势但重要的特征**，就失去了多头注意力的多维度观察能力





### The Residuals

在每个encoder中的每个子层（self-attention、ffnn）周围都有一个残差连接: Resudual Connection (Add&norm中的Add).

Add做的事其数学表达式极为简洁：**Output = x + Sublayer(x)**。

Layer norm的任务是将神经元的输出分布重新调整为均值为 0、方差为 1 的标准分布。简单来说，就是将标准化后的向量进行一次线性变换：乘以一个训练出来的系数，再加上一个训练出来的常数。保证了无论输入数据的量级如何波动，传递到下一层的数值始终处于一个“可控”的范围内，从而极大增强了训练的稳定性。

因此残差层的存在解决深层网络在训练过程中面临的**梯度消失（Gradient Vanishing）**和**模型退化（Degradation）**问题


![image.png](/images/transformer-22.png)



> [!TIP]
>
> 由于残差连接引入了 **x+f(x)** 结构，所以当对这个函数求x的偏导时就会得到 **1+f'(x)** 。这样，即使在反向传播的过程中，f'(x)连续多层都非常小（例如接近于0），有了**“1”**的存在，梯度也不会在传播过程中消失，梯度依然能通过那个 **“1”** 顺畅地流回底层。
>
> 另外，Self-Attention 是一个极具“侵略性”的操作，它会根据上下文大幅度改写词向量的数值，可能导致原始词汇的某些关键特征丢失。通过 **x + Attention(x)**，模型在获取上下文信息的同时，强制保留了原始输入的特征。这对于保持语义的一致性至关重要。



如果把add和norm操作具像化表示，看起来就是这样子：
![image.png](/images/transformer-23.png)



一样的模式同样适用于decoder的子层：


![image.png](/images/transformer-24.png)



### Feed forward neural network

Attention层是负责处理 token 之间的水平交互，那么 FFNN 层就是负责对每个 token 进行 token 内部的特征转换。FFNN的全称叫 **Position-wise** FFNN，意味着它对序列中的每一个位置 x 独立地应用相同的线性变换。其标准结构包含 <u>两个线性层</u> 和一个*非线性激活函数:*


![image.png](/images/transformer-25.png)

我们可以从FFNN具体做了什么的过程中理解这个函数：

1. **升维**：将输入维度 d<sub>model</sub>（如 512）投影到一个更高的维度 d<sub>ff</sub>（通常是 4 x d<sub>model</sub>，如 2048)。这个过程并不是简单地填补随机数，	    而是模型内部有个学习好的权重矩阵 **W<sub>1</sub>**，其形状为(512, 2048)。然后通过计算 **x · W<sub>1 </sub>**就得到了升维后的矩阵

2. **激活函数**：一个非线性函数，我们熟知的 x<sup>2</sup>，x<sup>3</sup> 都是非线形函数，但由于计算效率和梯度稳定性的考量，

​		            我们通常使用 **ReLU ( f(x) = max(0, x) ）** 或 GELU。这一步至关重要，它引入了非线性，使模型能够学习复杂的模式。

3. **降维**：将维度从 2048 压缩回 512，以便与残差连接（Residual Connection）匹配，只保留对当前预测最有用的信息，剔除噪声。同	   样是通过矩阵乘法（乘以一个 (2048, 512) 的矩阵 **W~2~**）实现的。



> [!NOTE]
>
> **为什么需要引入一个非线形函数？**
>
> 我们可以反过来理解，如果过程中没有激活函数，只有线形变换(矩阵乘法)会怎么样？
>
> 1. 假设升维是 h = x · W~1~
> 2. 假设降维是 y = h · W~2~
> 3. 带入后可得 y = ( x · W~1~) · W~2~ = x · (W~1~ · W~2~)
> 4. W~1~ · W~2~ 只是另一个矩阵 W~new~ , 所以 **y = x · W~new~**
>
> 由此可见，无论有多少个线形层，从数学上来看都等价于一层。这样的函数就相当于初中学过的二维坐标轴上的线性规划，因此，只能在多维空间中画平面来切分数据。但真实世界的数据可能是环形或螺旋形的，线性平面永远无法将其正确切分。
>
> 引入**ReLU** 之后，函数变成了 y = x · max(0, W~1~)· W~2~  就具备了拟合任何复杂曲线和边界的能力。

> [!IMPORTANT]
>
> **W~1~**和**W~2~**权重矩阵和Attention层中的**W~Q~,W~K~,W~V~** 三个权重矩阵一样，都是通过海量数据的训练得到的。一开始里面的参数都是随机数，经过升维，激活，降维，变成512维输出，并最终输出一个预测值，再与实际值对比，就得出了一个误差值(Loss)。误差的梯度会顺着网络往回流，如果在之前的 2048 维中，**某个维度的激活导致了最终预测的准确（降低了 Loss）**，梯度优化算法就会**增大** **W~1~**和**W~2~**矩阵中连接该维度的权重。如果某个维度纯粹是噪音，增加了误差，优化算法就会把**W~1~**和**W~2~**矩阵中对应的权重压低，甚至逼近于 0。 就这样，经过海量数据的反复洗礼， **W~1~**和**W~2~**矩阵在数学上自然演化成了一个“过滤器”——高权重的通道保留有用特征，低权重的通道屏蔽无用特征



至此为止，encoder部分就结束了，接下来进入decoder。



# Decoder

在 Transformer 的设计中，Encoder 负责理解，Decoder 负责生成：一边观察着 Encoder 提供的上下文（Context），一边根据已经生成的字，推测下一个字。但这件事有一个矛盾：**训练时知道完整答案，推理时不知道**。模型必须在同一套结构下，既能在训练阶段并行处理整个目标序列（否则训练会慢到无法接受），又能在推理阶段严格保证"不能偷看未来"。解决这个问题的方式，就在Decoder的三层结构中。

![image.png](/images/transformer-27.png)





### Self-Attention

所有**生成任务的本质**就是在回答：

> 给定输入 x，输出 y 的概率是多少？

在Transformer中是这么表示的：


![image.png](/images/transformer-26.png)



含义为：生成第t个token，需要依赖----已经生成的**前t-1个token**， 以及源序列的全部信息**x**

也就说，在decoder中，生成第1个token，需要依赖encoders的输出x

​					  生成第2个token，需要依赖encoders的输出x， 以及第1个token

​					  生成第3个token，需要依赖encoders的输出x， 以及第1个和第2个token		

​			  		生成第4个token，需要依赖encoders的输出x， 以及第1个和第2个和第3个token

​					   ........



这也就是decoder中的一个核心：**自回归生成(Autoregressive)**。 "自回归"的字面意思是: **用自己过去的输出作为下一步的输入**。但在训练阶段和推理阶段，自回归的输入会有所不同。

在**推理阶段**，第 $t$ 个字必须依赖第 $t-1$ 个字的结果，这种逻辑依赖在时间轴上是**线性不可并行**的。比如：

> 已知: "AI is helpful,"  →  预测: "I" 
>
> 已知: "AI is helpful, I"  →  预测: "love" 
>
> 已知: "AI is helpful, I love"  →  预测: "AI"
>
> 已知: "AI is helpful, I love AI"  →  预测: [EOS]

天然串行，你不知道第1个词是什么，就没法预测第2个词

 

在**训练阶段**，是通过 Teacher Forcing 和 Masked self-attention 进行**并行运算**。这是怎么实现的呢？

假设训练样本还是：

> 源句：AI is helpful
>
> 目标句：I love AI

模型需要学的是：

- 看到 *[BOS]*, 应该输出"I"
- 看到 *[BOS] I*, 应该输出"love"
- 看到 *[BOS] I love*, 应该输出"AI"
- 看到 *[BOS] I love AI*, 应该输出 [EOS]

看起来似乎与推理阶段并无二样，都是根据已有的输入推测出下一个输出。但关键点就在于 **训练时已经知道答案了**。**Teacher forcing**的机制是模型根据源输入 *x*，推测出第一个输出，但是第二份输入并**不是**由 ***x* + 模型推测出的第一个输出** 组成的(与推理阶段不同)，而是由 ***x* + 答案中对应的第一个词** 组成的。所以在训练阶段，模型推测下一个词永远是基于正确答案的基础上。

那么这是否意味着训练阶段的机制是，已知 *x* ，得出推测的 *y~1~*，然后用答案里的 *Y~1~* 替代 *y~1~*，接着进行下一步推测呢？ 不是的，因为这样就串行了，训练效率会大打折扣。实际上，思考下训练的目的，**我们不关心模型的预测结果是什么，我们只关心它的损失函数**。而损失函数就是预测值和实际值之间的差别，现在我们已经有了实际值，只需要得到在对应位置的预测值就能计算损失函数。因此整个过程完全可以是并行计算的。

在当前训练样本中，根据模型需要学的，可以分为4个预测任务：

> 任务1的输入: [BOS] 
>
> 任务2的输入: [BOS] I 
>
> 任务3的输入: [BOS] I love 
>
> 任务4的输入: [BOS] I love AI

四个任务是并行计算的，每个任务只管根据自己已有的输入推测出输出即可。就能得到一一对应的 预测-实际 对。在实际的实现中，会把这四个任务打包成矩阵: **[[BOS], I, love, AI]** 进行attention计算

那么问题又来了，整个矩阵一起输入，位置3("love")在做attention的时候，会不会偷看到位置4("AI")的值呢？ 如果不加任何限制的话，当然会看到。这也就引入了另一个核心的机制: **Masked self-attention**, 这也是并行的关键

> Attention Score 矩阵（4×4）：
>
> ​		[BOS]     I        love      AI
>
> [BOS]      [  ✓         ✗         ✗          ✗  ]   ← 只能看自己
> I      	 [  ✓         ✓        ✗          ✗  ]   ← 能看[BOS]和自己
> love         [  ✓         ✓        ✓         ✗  ]   ← 能看前两个和自己
> AI   	  [  ✓         ✓        ✓        ✓  ]   ← 能看所有

还记得做self-attention时有一个步骤是做 **Softmax** 吗，✗ 的位置填入 `-∞`，经过 Softmax 之后变成 0，**等效于这个位置的信息不存在**，看起来像是遮住了输出，实际就是切断了attention的路径。

> [!WARNING]
>
> 由于推理时，每个位置的输入是**模型自己上一步的输出**，这也意味着一旦某一步出错，错误就会沿着序列传播放大。因为模型训练时没有遇到过“前面是错的”这种情况，所以输出会一错再错。也就会造成模型**正儿八经地胡言乱语**情况的发生，这就是并行训练的代价：**Exposure Bias **(曝光偏移)





### Cross attention

我们已经了解了decoder的基础层：Masked self-attention。 接下来进入到连接层: Cross attention, 也叫做 **Encoder-Decoder Attention**, 这是decoder最独特的地方。回看decoder整体的架构，可以看到在Encoder-Decoder Attention层，有一个箭头指向它，这个箭头来自Encoder层的输出 **矩阵Z**。 看到这，自然又有一个疑惑产生了，为什么Encoder的输出流向Encoder-Decoder Attention呢，为什么不是decoder self-attention？不是说好了有源输入x，才能推测出第一个字，然后才能推出第二个字吗，现在decoder self-attention什么输入也没有，之前提到的Teacher Forcing + Masked self-attention机制难道没用了吗？

为了解答这个疑惑，我们同样从训练阶段和推理阶段解析。

在**推理阶段**，decoder self-attention并不是没有任何输入，推理开始时, decoder 有一个**人工给定的起始特殊 token**: [BOS] 。然后推理第一步的完整流程就开始了：**输入 [BOS]**  ----> **Embedding + Positional Embedding** ----> **Masked self-attention** ----> **得到一个隐状态矩阵h**  ----> **Q = h * W<sup>Q</sup>**  ----> **Cross-attention (与Encoder的K，V结合)** ----> **预测出第一个词**

> [!TIP]
>
> - 【BOS】 就是 Beginning of Sequence 的缩写.   [EOF] 是 End of Sequence 的缩写
>
> - 和encoder层一样，decoder也有Embedding + Positional Embedding
>
> - decoder的W<sup>Q</sup>和encoder的W<sup>Q</sup>, W<sup>K</sup>, W<sup>V</sup>一样，一开始也是随机生成的复合特定分布的参数矩阵，而后经过训练的矩阵
>
> - encoder层的输出是一个矩阵Z，因此这里的与encoder的K，V结合实际说的是decoder 拿到 Z 之后，**实时计算** K 和 V:
>
>   K = Z * W<sup>K</sup>       ← Z 乘以一个可训练的投影矩阵
>
>   V = Z * W<sup>V</sup>       ← Z 乘以一个可训练的投影矩阵
>
>   W<sup>K</sup> 和 W<sup>V</sup>是 Cross-Attention 层自己的参数，不是 Encoder 里的。
>
>   因此**K 和 V 不是"保存"在 Encoder 里的，而是每次推理时从 Z 临时投影出来的。**



在**训练阶段**，decoder self-attention更加不是没有任何输入，相反，训练时，`[BOS] I love AI` 这个序列是**数据集里直接拿来的**,也就是说self-attention此时拥有完整答案。具体操作是 **Shifted Right**：

```
原始目标序列：    I      love    AI    [EOS]
Decoder 输入： [BOS]     I     love    AI      ← 整体右移一位
Decoder 目标：   I      love    AI    [EOS]    ← 每个位置预测下一个词
```

这里预测下一个词就回到了上面所讲的Masked self-attention了。在训练阶段，self-attention需要和cross attention串行结合去推测出下一个词，然后与实际值比较，反向传播，更新所有参数，以此降低损失函数，而这整个过程是并行的。

> Decoder 侧（**四个位置同时并行**）：   
>
> 输入：[BOS]  I    love    AI          
>
> ​		↓      ↓       ↓      ↓  
>
> ​	   Masked Self-Attention (整合各自能看到的前缀上下文）          
>
> ​			↓  
>
> ​	   隐状态 h → Q         
>
>  ​		        ↓  
>
> ​	   Cross-Attention（与 Z 的 K、V 结合）  
>
> ​	（从源序列里提取对应内容）         
>
>  ​			↓  
>
> ​		    FFN         
>
>  ​			↓  
>
> 预测：  I    love   AI  [EOS]



明白了这点，我们也明白了Q / K / V 的来源。这是 Cross-Attention 与 Self-Attention 最本质的区别。在 Self-Attention 中，Q、K、V 三者同源；但在 Cross-Attention 中，它们实现了“跨界握手”。这也就是Cross-Attention 做的事：拿着 Q 这个问题，去 K 里检索哪些位置最相关，然后按相关程度加权提取 V。





### Feed-Forward Network

Decoder层的FFN与Encoder层的FFN在**结构上完全相同**，都是包含 <u>两个线性层</u> 和一个*非线性激活函数*


![image.png](/images/transformer-25.png)

但输入的**信息性质根本不同**：

**Encoder FFN 的输入**：仅包含源输入序列的自注意力特征。

**Decoder FFN 的输入**：包含目标输出已生成序列的特征，且这些特征已经通过 Cross-Attention 层深度融合了源输入的信息。

因此，两者在训练过程中学习到的权重完全不同





### Linear & Softmax

这是 Decoder 的最后两步，**把 FFN 输出的向量转换成词汇表上的概率分布**。没有这两个层，模型将只能停留在数学抽象层面，无法输出具体单词。

**Linear** 层负责将来自 Decoder 最后一个 Block 输出的隐藏状态矩阵 $h$ 投射到全局词表空间：
$$
logits = h * Wvocab + b
$$

- h shape: [seq_len, d_model]
- W~vocab~  shape: [d_model, vocab_size] 
- logits shape: [seq_len, vocab_size] 

词汇表有多大，输出就有多少维。每一个维度对应词汇表里的一个 token，数值叫做 **logit**。代表了模型认为“下一个词是该单词”的**原始信心得分**。得分越高，可能性越大。

> [!TIP]
>
> 在研究Transformer的过程中经常可以看到说某个矩阵其维度为：$[batch\_size, seq\_len, d_{model}]$
>
> - $batch\_size$: **一次并行处理的样本数量**。比如值为2，就代表同时处理两句话。
>
>   “*可能你会有疑问。怎么算两句话，用句号问号等标点符号区分吗？这段话算几句话？*” 这算一句话。因为标点符号只是软约束，是概率模式，而不是硬约束。默认情况下，模型不会把它“结构化地”识别成两句话，只会当成一个连续 token 序列处理。
>
>   要想显式地把句子分成多句话，可以采用分隔符 **[SEP]**, 比如: "AI is helpful.[SEP] I love AI"， 此时$batch\_size$=2。
>
>   还有一种方法是完全拆开: batch = ["AI is helpful", "I love AI"] 这样两句话完全独立，不共享attention
>
> - $seq\_len$ : 每个序列的**token 数**（有多少行）
>
> - $d_{model}$: 每个 token 的**向量维度**，也叫隐藏状态维度(有多少列)



由于logit是原始得分，范围在$(-\infty, +\infty) $，不能直接用。因此需要 **Softmax** 把它转换成概率分布，这样就会产生一个长度为 $\text{vocab\_size}$ 的概率向量，每一个位置代表选择该单词的概率。



> [!NOTE]
>
> 细心的读者可能发现了， Linear 层的权重 $W_{vocab} $ 和输入 Embedding 矩阵共享同一套参数:
>
> - Embedding 矩阵：  [vocab_size, d_model]      把 token id → 向量 
> - Linear 矩阵：           [d_model, vocab_size]      把向量 → logits
>
> 两者互为转置，**本质上是同一件事的正向和反向**，共享参数既减少了参数量，也让两端的语义空间保持一致



到这里为止，整个Transformer框架就走完了 🎉🎉🎉



接下去以问答的形式完成最后一些思考



# Q&A

**Q： **

**<u>什么是KV Cache ? 它为什么那么重要，它省掉了什么计算？又有什么副作用？</u>**

**A**：  

KV Cache的核心逻辑是**空间换时间**，在decoder阶段，更准确地说是在autoregressive阶段，只计算当前最新输入的那个 Token 的Q, K, V，而历史 Token 的 K 和 V 直接从内存中读取。

问题根源来自于自回归的本质：Transformer 生成文本是**逐 token 自回归**的。如果没有KV Cache，假设当前序列长度为 n，生成	第 n+1 个 token 时，前 n 个 token 的 K、V **和上一步完全相同**，却要被重新计算一遍。这种计算量随序列长度呈**平方级**增长（$O(N^2)$）。

因此KV Cache 的核心在于：**只计算当前最新输入的那个 Token 的 Q, K, V，而历史 Token 的 K 和 V 直接从内存中读取**。 这也就意	味着每计算完一个token的k~t~，v~t~就把值写入缓存 [k~1~, ...., k~n~],  [v~1~, ...., v~n~]。这样子，当计算到第n+1个token时，仅为第 $n+1$个 	token 计算 $q_{n+1}, k_{n+1}, v_{n+1}$ , 接着将$k_{n+1}, v_{n+1}$也写入缓存，就像之前做的那样。然后使用当前 $q_{n+1}$ 去与 **全部** 的 $K$做点积，得到	注意力权重。最后将权重作用于 **全部** 的 $V$。KV Cache 将生成过程从“每次重算整个序列”简化为“每次只算一个新点”，此时单步生成复杂	度减少为了$O(N)$。

那么代价是什么呢？KV Cache 随序列增长而迅速增大。例如 FP16 精度下，一个 7B 模型在 2048 上下文时，KV Cache 可能占用约 1GB 显存。这也就是空间换时间，瓶颈从 GPU 的计算能力转移到了**显存带宽**



**Q：**

<u>**为什么“首字延迟（Time To First Token）”通常比“后续字延迟（TPOT）”大得多？**</u>

**A：**

因为KV Cache只加速了decoding阶段，并没有加速prefill阶段。因此慢的主要原因是 Prefill 阶段的计算量

- Prefill：  用户输入 prompt，并行计算所有 token 的 KV → 存入 cache           这一步无法跳过，必须全量计算 
- Decode：   逐个生成新 token，每步只算新 Q，KV 从 cache 取           这一步是 KV Cache 真正发挥作用的地方

后续 token 快，是因为 Decode 阶段有 KV Cache 且每步计算量极小。





**Q：**

<u>**为什么AI会一个字一个字地蹦(Streaming)？**</u>

**A：**

因为模型是逐token生成的，服务端可以逐 token 推送但是也可以等生成完成后一次性返回。Streaming 是**工程层决策**，“蹦”是 UI 设计



**Q：**

<u>**为什么输入越长回复越慢？**</u>

**A：**

输入越长，意味着需要做的tokenization越多，token也就会越多，那么evaluate self-attention score的计算量就越多，且推理时复杂度是累加的。

生成第 1 个 token：看 n
生成第 2 个 token：看 n+1
生成第 3 个 token：看 n+2

整体是：

```
O(n² + n(n+1) + ...)
```

所以长输入不仅慢一次，而是整个生成过程都变慢。



**Q：**

<u>**现代GPT系列用的是什么架构？**</u>

**A：**

在当代 LLM时代，GPT 系列使用的是 **Decoder-only** 架构。Decoder-only架构取消了连接encoder和decoder的cross attention层，原本由 Encoder 提供的“源文信息”被直接合并到了同一个输入序列中。所谓“Encoder 的数据”，现在就藏在序列的 Prompt（提示词） 部分，输入的 Prompt（原本属于 Encoder 的内容）和模型即将生成的回答（原本属于 Decoder 的内容）被拼接成了一个长序列，通过 Masked Self-Attention 进行传递。

