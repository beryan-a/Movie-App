namespace Backend.models;
public class maxHeap 
{
    //Inner class representing one node in the heap
    public class HeapNode
    {
        internal userNode data;
        internal HeapNode left, right, parent;
        public HeapNode(userNode data)
        {
            this.data = data;
        }
    }

    private HeapNode root; //the highest similarity
    private int size;

    public maxHeap()
    { //initial values(empty)
        root = new HeapNode(null);
        size = 0; 
    }

//--------------------------------------------------------------
    public int getSize() { return size; }
    public bool isEmpty() { return size == 0; }
    public userNode peek()
    {
        if (root == null)return null;
        return root.data;
    }

    public void insert(userNode user)
    {
        HeapNode newNode = new HeapNode(user);
        size++;

        if (root == null)
        { //empty heap(root) case
            root = newNode;
            return;
        }

        HeapNode parent = findNode(size/2);
        newNode.parent = parent;

        if(parent.left == null)
        {
            parent.left = newNode;
        }
        else
        {
            parent.right = newNode;
        }

        bubbleUp(newNode);
    }

    public userNode extractMax()
    {
        if(root == null) return null;

        userNode maxData = root.data;

        if(size == 1)
        {
            root = null; 
            size--;
            return maxData;
        }

        HeapNode lastNode = findNode(size);
        root.data = lastNode.data;

        HeapNode lastParent = lastNode.parent;
        //lastNode u sondan çıkarmak için onun parenti ile arasındaki bağlantıyı siliyoruz
        if (lastParent.right == lastNode) {
            lastParent.right = null;
        } else {
            lastParent.left = null;
        }
        size--;

        bubbleDown(root); //Heap düzenini tekrar kurar.
        return maxData;
        
    }

    public HeapNode findNode(int index)
    {
        // heap index starts from 1 (0 or less invalid)
        if (index <= 0) return null;

        string binaryString = Convert.ToString(index,2);

        HeapNode current = root; // start searching from root

        // Binary temsilin ilk karakteri her zaman '1' olur
        // Bu '1' root'u temsil eder, zaten root'ta başladığımız için bunu SKIP ediyoruz
        for (int i = 1; i < binaryString.Length; i++) {   // skip leading '1'
            
            // Eğer bit '0' ise:
            // → sol çocuk (left child) yönüne git
            if (binaryString[i] == '0') {
                current = current.left;
            }
            // Eğer bit '1' ise:
            // → sağ çocuk (right child) yönüne git
            else {
                current = current.right;
            }
        }
        return current;
    }

    private void bubbleUp(HeapNode node)
    {
        while(node.parent != null &&
              node.data.CompareTo(node.parent.data) >0)
        {
            userNode temp = node.data;
            node.data = node.parent.data;
            node.parent.data = temp;
            node = node.parent;
        }
    }

    private void bubbleDown(HeapNode node)
    {
        while (true)
        {
            HeapNode largest = node;

            if(node.left != null &&
            node.left.data.CompareTo(largest.data) > 0)
            {
                largest=node.right;
            }

            if(largest==node) break;

            userNode tmp = node.data;
            node.data = largest.data;
            largest.data = tmp;
            node = largest;
        }
    }

    public void buildHeap(List<userNode> users)
    {
        root = null;
        size = 0;

        foreach(userNode u in users)
        {
            insert(u);
        }
    }

    public List<userNode> drainToList()
    {
        List<userNode> result = new List<userNode>();

        while (!isEmpty())
        {
            result.Add(extractMax());
        }
        return result;
    }



}
