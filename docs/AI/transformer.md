# Transformer

说明

下面内容主要来自于[The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)，非常棒的文章。再加上一些补充以及一些理解

---

# Overview

------

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

------

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

------

