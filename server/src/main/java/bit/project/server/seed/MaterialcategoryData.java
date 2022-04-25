package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class MaterialcategoryData extends AbstractSeedClass {

    public MaterialcategoryData(){
        addIdNameData(1, "Wood");
        addIdNameData(2, "Glue");
        addIdNameData(3, "Sand Paper");
        addIdNameData(4, "Glass");
    }

}