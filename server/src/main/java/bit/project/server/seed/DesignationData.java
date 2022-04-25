package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DesignationData extends AbstractSeedClass {

    public DesignationData(){
        addIdNameData(1, "First Line Carpenter");
        addIdNameData(2, "Second Line Carpenter");
        addIdNameData(3, "Helper");
        addIdNameData(4, "Driver");
        addIdNameData(5, "Officer");
    }

}
