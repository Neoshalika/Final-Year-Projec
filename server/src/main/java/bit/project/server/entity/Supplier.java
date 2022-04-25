package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Supplier{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String email;

    private String fax;

    private String contact1;

    private String contact2;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;

    @ManyToOne
    private Supplierstatus supplierstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Porder> supplierPorderList;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Purchase> supplierPurchaseList;


    @ManyToMany
        @JoinTable(
        name="suppliermaterialcategory",
        joinColumns=@JoinColumn(name="supplier_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="materialcategory_id", referencedColumnName="id")
    )
    private List<Materialcategory> materialcategoryList;


    public Supplier(Integer id){
        this.id = id;
    }

    public Supplier(Integer id, String code, String name, String email, String contact1){
        this.id = id;
        this.code = code;
        this.name = name;
        this.email = email;
        this.contact1 = contact1;
    }

}
